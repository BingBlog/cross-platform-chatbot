-- 跨平台AI聊天机器人数据库初始化脚本
-- 此脚本用于手动创建数据库和基础配置

-- 创建数据库（如果不存在）
-- CREATE DATABASE chatbot_db;

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 创建自定义函数：生成CUID
CREATE OR REPLACE FUNCTION generate_cuid() RETURNS text AS $$
DECLARE
    timestamp_part text;
    counter_part text;
    random_part text;
    checksum_part text;
BEGIN
    -- 时间戳部分（36进制）
    timestamp_part := lpad(to_char(extract(epoch from now()) * 1000, 'FM999999999999999'), 8, '0');
    
    -- 计数器部分（随机）
    counter_part := lpad(to_char((random() * 1000000)::int, 'FM999999'), 4, '0');
    
    -- 随机部分
    random_part := encode(gen_random_bytes(8), 'base64');
    random_part := replace(replace(random_part, '/', '_'), '+', '-');
    random_part := substring(random_part from 1 for 8);
    
    -- 校验和部分
    checksum_part := lpad(to_char((random() * 10000)::int, 'FM9999'), 2, '0');
    
    RETURN 'c' || timestamp_part || counter_part || random_part || checksum_part;
END;
$$ LANGUAGE plpgsql;

-- 创建全文搜索配置
CREATE TEXT SEARCH CONFIGURATION IF NOT EXISTS chatbot_search (COPY = simple);

-- 创建全文搜索字典（中文支持）
CREATE TEXT SEARCH DICTIONARY IF NOT EXISTS chinese_stem (
    TEMPLATE = snowball,
    Language = chinese
);

-- 创建索引优化函数
CREATE OR REPLACE FUNCTION update_message_count() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE chat_sessions 
        SET message_count = message_count + 1,
            last_message_at = NEW.created_at,
            updated_at = NOW()
        WHERE id = NEW.session_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE chat_sessions 
        SET message_count = message_count - 1,
            updated_at = NOW()
        WHERE id = OLD.session_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS update_session_message_count ON messages;
CREATE TRIGGER update_session_message_count
    AFTER INSERT OR DELETE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_message_count();

-- 创建数据清理函数
CREATE OR REPLACE FUNCTION cleanup_expired_sessions() RETURNS void AS $$
BEGIN
    -- 清理过期的用户会话
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() AND is_active = false;
    
    -- 清理过期的搜索历史（保留最近30天）
    DELETE FROM search_history 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- 清理过期的系统日志（保留最近90天）
    DELETE FROM system_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- 创建数据统计函数
CREATE OR REPLACE FUNCTION get_user_stats(user_id text) 
RETURNS TABLE(
    total_sessions bigint,
    total_messages bigint,
    total_tokens bigint,
    last_activity timestamp
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT cs.id) as total_sessions,
        COUNT(m.id) as total_messages,
        COALESCE(SUM(m.token_count), 0) as total_tokens,
        MAX(GREATEST(cs.updated_at, m.created_at)) as last_activity
    FROM users u
    LEFT JOIN chat_sessions cs ON u.id = cs.user_id
    LEFT JOIN messages m ON cs.id = m.session_id
    WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql;

-- 创建会话搜索函数
CREATE OR REPLACE FUNCTION search_sessions(
    user_id text,
    search_query text DEFAULT '',
    limit_count int DEFAULT 20,
    offset_count int DEFAULT 0
) RETURNS TABLE(
    session_id text,
    title text,
    description text,
    message_count int,
    last_message_at timestamp,
    relevance real
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cs.id as session_id,
        cs.title,
        cs.description,
        cs.message_count,
        cs.last_message_at,
        ts_rank(to_tsvector('chatbot_search', cs.title || ' ' || COALESCE(cs.description, '')), plainto_tsquery('chatbot_search', search_query)) as relevance
    FROM chat_sessions cs
    WHERE cs.user_id = search_sessions.user_id
        AND (search_query = '' OR to_tsvector('chatbot_search', cs.title || ' ' || COALESCE(cs.description, '')) @@ plainto_tsquery('chatbot_search', search_query))
    ORDER BY relevance DESC, cs.last_message_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- 创建消息搜索函数
CREATE OR REPLACE FUNCTION search_messages(
    user_id text,
    search_query text DEFAULT '',
    session_id text DEFAULT NULL,
    limit_count int DEFAULT 20,
    offset_count int DEFAULT 0
) RETURNS TABLE(
    message_id text,
    session_id text,
    content text,
    role text,
    created_at timestamp,
    relevance real
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id as message_id,
        m.session_id,
        m.content,
        m.role::text,
        m.created_at,
        ts_rank(to_tsvector('chatbot_search', m.content), plainto_tsquery('chatbot_search', search_query)) as relevance
    FROM messages m
    JOIN chat_sessions cs ON m.session_id = cs.id
    WHERE cs.user_id = search_messages.user_id
        AND (search_query = '' OR to_tsvector('chatbot_search', m.content) @@ plainto_tsquery('chatbot_search', search_query))
        AND (search_messages.session_id IS NULL OR m.session_id = search_messages.session_id)
    ORDER BY relevance DESC, m.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- 插入系统配置
INSERT INTO system_config (key, value, description) VALUES
('app_name', 'Cross-Platform AI Chatbot', '应用程序名称'),
('app_version', '1.0.0', '应用程序版本'),
('max_sessions_per_user', '1000', '每个用户最大会话数'),
('max_messages_per_session', '10000', '每个会话最大消息数'),
('max_file_size', '10485760', '最大文件大小（字节）'),
('supported_file_types', 'jpg,jpeg,png,gif,pdf,txt,md,json', '支持的文件类型'),
('default_ai_model', 'qwen-turbo', '默认AI模型'),
('max_tokens_per_request', '4000', '每次请求最大Token数'),
('rate_limit_per_minute', '60', '每分钟请求限制'),
('session_timeout_minutes', '1440', '会话超时时间（分钟）'),
('backup_retention_days', '30', '备份保留天数'),
('log_retention_days', '90', '日志保留天数')
ON CONFLICT (key) DO NOTHING;

-- 创建性能监控视图
CREATE OR REPLACE VIEW user_activity_stats AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    u.last_login_at,
    COUNT(DISTINCT cs.id) as total_sessions,
    COUNT(m.id) as total_messages,
    COALESCE(SUM(m.token_count), 0) as total_tokens,
    COALESCE(SUM(au.cost), 0) as total_cost,
    MAX(cs.last_message_at) as last_activity_at
FROM users u
LEFT JOIN chat_sessions cs ON u.id = cs.user_id
LEFT JOIN messages m ON cs.id = m.session_id
LEFT JOIN api_usage au ON u.id = au.user_id
GROUP BY u.id, u.username, u.email, u.last_login_at;

-- 创建会话统计视图
CREATE OR REPLACE VIEW session_stats AS
SELECT 
    cs.id as session_id,
    cs.title,
    cs.user_id,
    u.username,
    cs.message_count,
    cs.last_message_at,
    cs.created_at,
    cs.ai_model,
    COUNT(fs.id) > 0 as is_favorite,
    COUNT(st.id) as tag_count
FROM chat_sessions cs
JOIN users u ON cs.user_id = u.id
LEFT JOIN favorite_sessions fs ON cs.id = fs.session_id
LEFT JOIN session_tags st ON cs.id = st.session_id
GROUP BY cs.id, cs.title, cs.user_id, u.username, cs.message_count, 
         cs.last_message_at, cs.created_at, cs.ai_model;

-- 创建API使用统计视图
CREATE OR REPLACE VIEW api_usage_stats AS
SELECT 
    DATE(created_at) as usage_date,
    api_provider,
    model,
    COUNT(*) as request_count,
    SUM(total_tokens) as total_tokens,
    SUM(cost) as total_cost,
    AVG(response_time) as avg_response_time,
    SUM(CASE WHEN success THEN 1 ELSE 0 END) as success_count,
    SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) as error_count
FROM api_usage
GROUP BY DATE(created_at), api_provider, model
ORDER BY usage_date DESC, total_tokens DESC;

-- 创建索引优化建议
COMMENT ON TABLE users IS '用户表 - 存储用户基本信息';
COMMENT ON TABLE chat_sessions IS '聊天会话表 - 存储用户聊天会话';
COMMENT ON TABLE messages IS '消息表 - 存储聊天消息内容';
COMMENT ON TABLE message_attachments IS '消息附件表 - 存储消息附件信息';
COMMENT ON TABLE user_settings IS '用户设置表 - 存储用户个性化设置';
COMMENT ON TABLE user_sessions IS '用户登录会话表 - 存储用户登录状态';
COMMENT ON TABLE favorite_sessions IS '收藏会话表 - 存储用户收藏的会话';
COMMENT ON TABLE session_tags IS '会话标签表 - 存储会话标签信息';
COMMENT ON TABLE search_history IS '搜索历史表 - 存储用户搜索记录';
COMMENT ON TABLE api_usage IS 'API使用统计表 - 存储API调用统计';
COMMENT ON TABLE system_config IS '系统配置表 - 存储系统配置参数';
COMMENT ON TABLE system_logs IS '系统日志表 - 存储系统运行日志';
COMMENT ON TABLE data_backups IS '数据备份表 - 存储备份记录';

-- 完成初始化
SELECT 'Database initialization completed successfully!' as status;
