# TOOLS.md - Local Notes

## HDTime PT站

- **URL**: https://hdtime.org
- **用户名**: huijiccc
- **密码**: cs9318158
- **Cookie**: 已保存在 /tmp/hdtime_cookies.txt
- **用途**: 下载电影、电视剧等影视资源

## 飞牛OS NAS (10.0.0.120)

- **IP**: 10.0.0.120
- **SSH端口**: 25
- **用户**: zhanghui
- **连接方式**: SSH密钥对（已配置）
- **备注**: 飞牛OS运行在Intel i3-12300T，31GB内存

### 存储路径

| 路径 | 说明 |
|------|------|
| /vol1 | 数据存储卷1 (btrfs+LVM+RAID1, ~7.3TB) |
| /vol2 | 数据存储卷2 (btrfs+LVM+RAID1, ~11TB) |
| /vol1/1000 | zhanghui用户的个人目录 |
| /vol2/1000 | zhanghui用户的个人文件（电影/电视剧/杂项） |

### 系统目录

| 路径 | 说明 |
|------|------|
| /vol1/@appcenter | 已安装应用目录 |
| /vol1/@appdata | 应用数据 |
| /vol1/@appmeta | 应用元数据 |
| /vol1/docker | Docker数据目录 |
| /vol1/thumb | 缩略图目录 |
| /vol2/vm | 虚拟机目录 |

### 用户权限

- zhanghui: uid=1000, gid=1001, Administrators组
- sudo免密配置已生效
- 已加入docker组，可直接运行docker命令

### Docker容器

| 容器名 | 端口映射 |
|--------|----------|
| searxng | 4000→8080 |
| chromium | 3000-3001 |
| plexserver | 3005, 32400, 1900(UDP) |

### ⚠️ 注意

- RAID处于降级状态 `[1/1]`，建议检查硬盘
- /home/zhanghui 目录不存在（用户实际目录在/vol1/1000）

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
