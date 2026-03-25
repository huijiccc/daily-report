// 收纳盒参数 (mm)
// 尺寸: 250 x 250 x 150 mm
// 材质: PETG

// 壁厚
wall_thickness = 3;

// 底部厚度
bottom_thickness = 4;

// 盒子内部尺寸
inner_width = 250 - wall_thickness * 2;
inner_depth = 250 - wall_thickness * 2;
inner_height = 150 - bottom_thickness;

// 盖子厚度
lid_thickness = 4;

// 盖子边缘包裹厚度
lid_lip = 5;

// 盒子外部尺寸
box_width = 250;
box_depth = 250;
box_height = 150;

// 通风孔直径
vent_hole = 8;

module box_body() {
    difference() {
        // 外壳
        cube([box_width, box_depth, box_height]);
        
        // 挖空内部
        translate([wall_thickness, wall_thickness, bottom_thickness]) {
            cube([inner_width, inner_depth, inner_height]);
        }
        
        // 四周通风孔（正面）
        for (x = [wall_thickness + 15:35:box_width - wall_thickness - 15]) {
            for (y = [bottom_thickness + 15:35:box_height - 10]) {
                translate([x, -1, y]) {
                    rotate([90, 0, 0]) {
                        cylinder(h = wall_thickness + 2, r = vent_hole/2, $fn = 16);
                    }
                }
            }
        }
        
        // 四周通风孔（背面）
        for (x = [wall_thickness + 15:35:box_width - wall_thickness - 15]) {
            for (y = [bottom_thickness + 15:35:box_height - 10]) {
                translate([x, box_depth + 1, y]) {
                    rotate([90, 0, 0]) {
                        cylinder(h = wall_thickness + 2, r = vent_hole/2, $fn = 16);
                    }
                }
            }
        }
        
        // 四周通风孔（左侧）
        for (y = [wall_thickness + 15:35:box_depth - wall_thickness - 15]) {
            for (z = [bottom_thickness + 15:35:box_height - 10]) {
                translate([-1, y, z]) {
                    rotate([0, 90, 0]) {
                        cylinder(h = wall_thickness + 2, r = vent_hole/2, $fn = 16);
                    }
                }
            }
        }
        
        // 四周通风孔（右侧）
        for (y = [wall_thickness + 15:35:box_depth - wall_thickness - 15]) {
            for (z = [bottom_thickness + 15:35:box_height - 10]) {
                translate([box_width + 1, y, z]) {
                    rotate([0, 90, 0]) {
                        cylinder(h = wall_thickness + 2, r = vent_hole/2, $fn = 16);
                    }
                }
            }
        }
    }
}

module box_lid() {
    // 盖子主体
    difference() {
        cube([box_width, box_depth, lid_thickness]);
        
        // 盖子上的通风孔
        for (x = [wall_thickness + 15:35:box_width - wall_thickness - 15]) {
            for (y = [wall_thickness + 15:35:box_depth - wall_thickness - 15]) {
                translate([x, y, -1]) {
                    cylinder(h = lid_thickness + 2, r = vent_hole/2, $fn = 16);
                }
            }
        }
    }
    
    // 边缘下垂（包裹盒子）
    translate([0, 0, -lid_lip]) {
        cube([lid_thickness, box_depth, lid_lip]);
        translate([box_width - lid_thickness, 0, 0]) {
            cube([lid_thickness, box_depth, lid_lip]);
        }
        translate([0, 0, -lid_lip]) {
            cube([box_width, lid_thickness, lid_lip]);
        }
        translate([0, box_depth - lid_thickness, 0]) {
            cube([box_width, lid_thickness, lid_lip]);
        }
    }
    
    // 顶部把手
    translate([box_width/2 - 15, box_depth/2 - 15, lid_thickness]) {
        cube([30, 30, 3]);
    }
}

// 渲染
box_body();
translate([0, 0, box_height + 5]) {
    box_lid();
}
