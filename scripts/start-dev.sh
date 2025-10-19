#!/bin/bash

# 开发环境快速启动脚本
# 同时启动后端服务和前端 web 应用

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${CYAN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# 检查依赖
check_dependencies() {
    log "检查依赖..."
    
    if ! command -v node &> /dev/null; then
        error "Node.js 未安装"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        error "npm 未安装"
        exit 1
    fi
    
    success "依赖检查通过"
}

# 安装依赖
install_dependencies() {
    log "安装依赖..."
    
    # 安装根目录依赖
    if [ ! -d "node_modules" ]; then
        log "安装根目录依赖..."
        npm install
    fi
    
    # 安装后端依赖
    if [ ! -d "packages/backend/node_modules" ]; then
        log "安装后端依赖..."
        cd packages/backend
        npm install
        cd ../..
    fi
    
    # 安装前端依赖
    if [ ! -d "packages/mobile-expo/node_modules" ]; then
        log "安装前端依赖..."
        cd packages/mobile-expo
        npm install
        cd ../..
    fi
    
    success "依赖安装完成"
}

# 启动后端服务
start_backend() {
    log "启动后端服务..."
    cd packages/backend
    
    # 在后台启动后端服务
    npm run dev > ../../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    
    cd ../..
    
    # 等待后端服务启动
    log "等待后端服务启动..."
    for i in {1..30}; do
        if curl -s http://localhost:3000/health > /dev/null 2>&1; then
            success "后端服务启动成功 (PID: $BACKEND_PID)"
            return 0
        fi
        sleep 1
    done
    
    error "后端服务启动超时"
    return 1
}

# 启动前端服务
start_frontend() {
    log "启动前端服务..."
    cd packages/mobile-expo
    
    # 启动前端服务
    npm run web &
    FRONTEND_PID=$!
    
    cd ../..
    
    success "前端服务启动成功 (PID: $FRONTEND_PID)"
    return 0
}

# 清理函数
cleanup() {
    log "正在停止服务..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        log "后端服务已停止"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        log "前端服务已停止"
    fi
    
    exit 0
}

# 显示使用说明
show_usage() {
    echo "开发环境启动脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -b, --backend  仅启动后端服务"
    echo "  -f, --frontend 仅启动前端服务"
    echo "  -c, --check    检查服务状态"
    echo ""
    echo "示例:"
    echo "  $0              # 启动所有服务"
    echo "  $0 --backend    # 仅启动后端"
    echo "  $0 --frontend   # 仅启动前端"
    echo "  $0 --check      # 检查服务状态"
}

# 检查服务状态
check_services() {
    log "检查服务状态..."
    
    # 检查后端
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        success "后端服务运行正常 (http://localhost:3000)"
    else
        warning "后端服务未运行"
    fi
    
    # 检查前端
    if curl -s http://localhost:8081 > /dev/null 2>&1; then
        success "前端服务运行正常 (http://localhost:8081)"
    elif curl -s http://localhost:19006 > /dev/null 2>&1; then
        success "前端服务运行正常 (http://localhost:19006)"
    else
        warning "前端服务未运行"
    fi
}

# 主函数
main() {
    # 创建日志目录
    mkdir -p logs
    
    # 设置信号处理
    trap cleanup SIGINT SIGTERM
    
    # 解析参数
    case "${1:-}" in
        -h|--help)
            show_usage
            exit 0
            ;;
        -b|--backend)
            check_dependencies
            install_dependencies
            start_backend
            log "后端服务已启动，按 Ctrl+C 停止"
            wait
            ;;
        -f|--frontend)
            check_dependencies
            install_dependencies
            start_frontend
            log "前端服务已启动，按 Ctrl+C 停止"
            wait
            ;;
        -c|--check)
            check_services
            exit 0
            ;;
        "")
            # 默认启动所有服务
            check_dependencies
            install_dependencies
            start_backend
            start_frontend
            
            log "所有服务已启动！"
            info "后端服务: http://localhost:3000"
            info "前端服务: http://localhost:8081 或 http://localhost:19006"
            info "按 Ctrl+C 停止所有服务"
            
            # 等待用户中断
            wait
            ;;
        *)
            error "未知选项: $1"
            show_usage
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"
