---
title: "Lập plan triển khai năng lực thành phần"
date: "2026-06-11"
type: "planning-journal"
---

# Lập plan triển khai năng lực thành phần

## Context

Khung 5 nhóm cha và 15 năng lực thành phần đã được duyệt cho tuyển đầu vào và
coaching ba tháng.

## What Happened

- Tạo plan 4 phase cho data model, Profile, Lifecycle/Journal và Entry Scorecard.
- Giữ 5 `CompetencyId`; thêm `CompetencyBranchId` và `branchIds` làm metadata.
- Giới hạn Entry Scorecard ở 7 nhánh; Final Scorecard tiếp tục dùng 5 nhóm cha.
- Ghi dependency với plan competency-scorecards và Progressive Spiral.

## Decisions

- Không thêm backend, route, dependency, Journal template hoặc hệ thống điểm mới.
- Không sửa file scorecard nguồn trong `knowledge/`.
- Phase Lifecycle phải chờ Progressive Spiral hoàn tất để tránh xung đột.

## Next

Đối chiếu trạng thái hai plan đang chặn, sau đó triển khai tuần tự từ Phase 1.
