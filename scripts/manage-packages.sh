#!/bin/bash

# 独立包管理脚本
# 用于管理完全独立的子包

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 包列表
PACKAGES=("backend" "web" "desktop" "mobile-native" "mobile-expo" "shared" "mobile-shared")

# 显示帮助信息
show_help() {
    echo -e "${BLUE}独立包管理脚本${NC}"
    echo ""
    echo "用法: $0 [命令] [包名]"
    echo ""
    echo "命令:"
    echo "  list                   列出所有包"
    echo "  install [包名]         安装指定包的依赖"
    echo "  install-all            安装所有包的依赖"
    echo "  dev [包名]             启动指定包的开发服务器"
    echo "  build [包名]           构建指定包"
    echo "  build-all              构建所有包"
    echo "  test [包名]            测试指定包"
    echo "  test-all               测试所有包"
    echo "  clean [包名]           清理指定包的构建文件"
    echo "  clean-all              清理所有包的构建文件"
    echo "  status                 显示所有包的状态"
    echo "  help                   显示此帮助信息"
    echo ""
    echo "包名:"
    for package in "${PACKAGES[@]}"; do
        echo "  $package"
    done
    echo ""
    echo "示例:"
    echo "  $0 list"
    echo "  $0 install mobile-expo"
    echo "  $0 dev web"
    echo "  $0 build-all"
}

# 检查包是否存在
check_package() {
    local package=$1
    if [ ! -d "packages/$package" ]; then
        echo -e "${RED}错误: 包 '$package' 不存在${NC}"
        exit 1
    fi
}

# 列出所有包
list_packages() {
    echo -e "${BLUE}可用的包:${NC}"
    for package in "${PACKAGES[@]}"; do
        if [ -d "packages/$package" ]; then
            echo -e "  ${GREEN}✓${NC} $package"
        else
            echo -e "  ${RED}✗${NC} $package (不存在)"
        fi
    done
}

# 安装包依赖
install_package() {
    local package=$1
    echo -e "${YELLOW}安装 $package 的依赖...${NC}"
    cd "packages/$package"
    pnpm install
    cd ../..
    echo -e "${GREEN}✓ $package 依赖安装完成${NC}"
}

# 安装所有包依赖
install_all() {
    echo -e "${YELLOW}安装所有包的依赖...${NC}"
    for package in "${PACKAGES[@]}"; do
        if [ -d "packages/$package" ]; then
            install_package "$package"
        fi
    done
}

# 启动开发服务器
dev_package() {
    local package=$1
    echo -e "${YELLOW}启动 $package 开发服务器...${NC}"
    cd "packages/$package"
    
    case $package in
        "web")
            pnpm dev
            ;;
        "desktop")
            pnpm dev
            ;;
        "mobile-expo")
            pnpm start
            ;;
        "mobile-native")
            pnpm start
            ;;
        "backend")
            pnpm dev
            ;;
        *)
            echo -e "${RED}错误: 包 '$package' 不支持开发模式${NC}"
            exit 1
            ;;
    esac
}

# 构建包
build_package() {
    local package=$1
    echo -e "${YELLOW}构建 $package...${NC}"
    cd "packages/$package"
    pnpm build
    cd ../..
    echo -e "${GREEN}✓ $package 构建完成${NC}"
}

# 构建所有包
build_all() {
    echo -e "${YELLOW}构建所有包...${NC}"
    for package in "${PACKAGES[@]}"; do
        if [ -d "packages/$package" ] && [ -f "packages/$package/package.json" ]; then
            if grep -q '"build"' "packages/$package/package.json"; then
                build_package "$package"
            fi
        fi
    done
}

# 测试包
test_package() {
    local package=$1
    echo -e "${YELLOW}测试 $package...${NC}"
    cd "packages/$package"
    pnpm test
    cd ../..
    echo -e "${GREEN}✓ $package 测试完成${NC}"
}

# 测试所有包
test_all() {
    echo -e "${YELLOW}测试所有包...${NC}"
    for package in "${PACKAGES[@]}"; do
        if [ -d "packages/$package" ] && [ -f "packages/$package/package.json" ]; then
            if grep -q '"test"' "packages/$package/package.json"; then
                test_package "$package"
            fi
        fi
    done
}

# 清理包
clean_package() {
    local package=$1
    echo -e "${YELLOW}清理 $package...${NC}"
    cd "packages/$package"
    
    # 清理node_modules
    if [ -d "node_modules" ]; then
        rm -rf node_modules
    fi
    
    # 清理构建文件
    if [ -d "dist" ]; then
        rm -rf dist
    fi
    
    if [ -d "build" ]; then
        rm -rf build
    fi
    
    cd ../..
    echo -e "${GREEN}✓ $package 清理完成${NC}"
}

# 清理所有包
clean_all() {
    echo -e "${YELLOW}清理所有包...${NC}"
    for package in "${PACKAGES[@]}"; do
        if [ -d "packages/$package" ]; then
            clean_package "$package"
        fi
    done
}

# 显示包状态
show_status() {
    echo -e "${BLUE}包状态:${NC}"
    for package in "${PACKAGES[@]}"; do
        if [ -d "packages/$package" ]; then
            echo -n "  $package: "
            
            # 检查是否有package.json
            if [ -f "packages/$package/package.json" ]; then
                echo -n "${GREEN}✓${NC} "
            else
                echo -n "${RED}✗${NC} "
            fi
            
            # 检查是否有node_modules
            if [ -d "packages/$package/node_modules" ]; then
                echo -n "${GREEN}依赖已安装${NC} "
            else
                echo -n "${YELLOW}依赖未安装${NC} "
            fi
            
            # 检查是否有构建文件
            if [ -d "packages/$package/dist" ] || [ -d "packages/$package/build" ]; then
                echo -e "${GREEN}已构建${NC}"
            else
                echo -e "${YELLOW}未构建${NC}"
            fi
        else
            echo -e "  $package: ${RED}不存在${NC}"
        fi
    done
}

# 主函数
main() {
    case $1 in
        "list")
            list_packages
            ;;
        "install")
            if [ -z "$2" ]; then
                echo -e "${RED}错误: 请指定包名${NC}"
                exit 1
            fi
            check_package "$2"
            install_package "$2"
            ;;
        "install-all")
            install_all
            ;;
        "dev")
            if [ -z "$2" ]; then
                echo -e "${RED}错误: 请指定包名${NC}"
                exit 1
            fi
            check_package "$2"
            dev_package "$2"
            ;;
        "build")
            if [ -z "$2" ]; then
                echo -e "${RED}错误: 请指定包名${NC}"
                exit 1
            fi
            check_package "$2"
            build_package "$2"
            ;;
        "build-all")
            build_all
            ;;
        "test")
            if [ -z "$2" ]; then
                echo -e "${RED}错误: 请指定包名${NC}"
                exit 1
            fi
            check_package "$2"
            test_package "$2"
            ;;
        "test-all")
            test_all
            ;;
        "clean")
            if [ -z "$2" ]; then
                echo -e "${RED}错误: 请指定包名${NC}"
                exit 1
            fi
            check_package "$2"
            clean_package "$2"
            ;;
        "clean-all")
            clean_all
            ;;
        "status")
            show_status
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            echo -e "${RED}错误: 未知命令 '$1'${NC}"
            echo "使用 '$0 help' 查看帮助信息"
            exit 1
            ;;
    esac
}

# 检查是否在正确的目录
if [ ! -f "package.json" ] || [ ! -d "packages" ]; then
    echo -e "${RED}错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 运行主函数
main "$@"
