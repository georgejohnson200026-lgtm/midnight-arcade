# Blender Fountain Guide for Complete Beginners

## What type of Blender work are you doing?
You are mainly doing:

1. General 3D modeling (primary)
2. Basic animation (optional, for moving water)
3. Basic shading/material setup

You are mostly NOT doing:

1. 2D animation
2. Storyboarding
3. Video editing
4. Heavy VFX (unless you later add advanced particles/simulations)
5. Sculpting (optional only for worn stone details)

## Plain-English category mapping
If Blender asks you to choose or switch workflows, this is what each means:

1. General:
   Best for building 3D objects (this is what you need now).
2. Sculpting:
   For clay-like organic shaping. Not needed for your first fountain.
3. Animation:
   For keyframes and object motion. You may use this for water movement.
4. VFX:
   For simulation-heavy workflows like complex fluid or smoke.
5. Video Editing:
   For editing rendered videos. Not used for making game assets.
6. 2D Animation:
   For Grease Pencil drawings. Not relevant for this 3D fountain.
7. Storyboarding:
   For planning shots/scenes. Not needed for game asset creation.

Rule of thumb: Start in General, then briefly use Animation if you want moving water.

## Goal
Create one realistic fountain asset you can import into your game:

1. Stone base and bowls (solid geometry)
2. Water surfaces inside bowls
3. Visible flowing water streams
4. Optional spray droplets
5. Export as GLB for web/Three.js

## Part A: First-time Blender setup (5 minutes)

1. Open Blender.
2. On startup, choose General.
3. Delete the default cube:
   - Left click cube
   - Press X, then Enter
4. Save project immediately:
   - File > Save As
   - Name it fountain_v1.blend

## Part B: Build the fountain stone structure (20-30 minutes)

### 1) Create base pedestal

1. Add > Mesh > Cylinder
2. Bottom-left Add Cylinder panel:
   - Vertices: 48
   - Radius: about 3.2
   - Depth: about 1.2
3. Press S then Shift+Z to scale only X and Y slightly wider.
4. Press G then Z to place it above the grid if needed.
5. Add modifier:
   - Wrench icon > Add Modifier > Bevel
   - Amount: small (0.03 to 0.08)
   - Segments: 3

### 2) Create lower bowl (with thickness)

1. Add > Mesh > UV Sphere
2. In Add UV Sphere panel: Segments 48, Rings 24
3. Go to Edit Mode (Tab)
4. Select top half faces and delete (X > Faces) so it becomes a bowl shape.
5. Return to Object Mode.
6. Scale bowl wider and flatter (S, then Z smaller).
7. Add Solidify modifier:
   - Thickness about 0.08 to 0.15
8. Position bowl above pedestal.

### 3) Add center column

1. Add > Mesh > Cylinder
2. Make it narrower and taller.
3. Place it in the exact center of the lower bowl.

### 4) Add top bowl and top ring support

1. Duplicate lower bowl (Shift+D), then scale down.
2. Move it upward onto the center column.
3. Add a support piece under the top ring:
   - Add > Mesh > Cylinder
   - Make it thin and short
   - Place directly under top ring area
4. Add top ring:
   - Add > Mesh > Torus
   - Place where you want the decorative ring
5. Ensure the ring intersects or sits on the support piece so it does not look floating.

### 5) Smooth shading

1. Select each stone object
2. Right click > Shade Smooth
3. Object Data Properties (green triangle) > Normals > enable Auto Smooth
4. Angle around 30 to 45 degrees

## Part C: Create water that looks 3D (15-20 minutes)

### 1) Water inside bowls

1. Add > Mesh > Circle or Cylinder cap-like disk
2. Fill it so it becomes a flat surface
3. Place this water mesh slightly below bowl rim (very important)
4. Duplicate for each bowl

### 2) Flowing water off the bowl edges

1. Add > Curve > Bezier
2. In Edit Mode, shape it from top bowl edge down to lower bowl area.
3. Duplicate the curve several times around the bowl (Shift+D, rotate around Z).
4. Give curves thickness:
   - Curve Data Properties > Geometry > Bevel > Depth around 0.01 to 0.03
5. Convert curves to mesh if needed:
   - Object > Convert > Mesh

### 3) Main arcs from top nozzle

1. Create one Bezier curve from top nozzle to lower basin.
2. Shape as a nice arc.
3. Duplicate around circle.
4. Keep stream thickness subtle and consistent.

## Part D: Materials (simple realistic setup)

### Stone material

1. Select stone object
2. Material Properties > New
3. Principled BSDF settings:
   - Base Color: gray-blue stone tone
   - Roughness: 0.6 to 0.8
   - Metallic: 0.0 to 0.1
4. Optional: add Noise Texture into Normal (through Bump node) for subtle stone detail.

### Water material

1. Select water meshes
2. Material Properties > New
3. Principled BSDF:
   - Base Color: dark blue
   - Transmission: 1.0
   - Roughness: 0.02 to 0.12
   - IOR: 1.333
4. Optional: tiny normal noise so it is not perfectly flat.

## Part E: Optional water movement animation (10-20 minutes)

### Very simple method (recommended first)

1. Select a water surface mesh.
2. At frame 1:
   - Slightly scale it in X and Y
   - Press I > Scale
3. Move to frame 30:
   - Tiny different scale
   - Press I > Scale
4. In Graph Editor, set interpolation to Linear or smooth loop.

### Stream pulse (optional)

1. Select stream mesh
2. Keyframe slight scale or subtle shape key motion
3. Keep movement very small to avoid unrealistic jitter

## Part F: Export correctly for game use (GLB)

1. Rename objects clearly in Outliner:
   - fountain_stone
   - fountain_water_top
   - fountain_water_lower
   - fountain_streams
2. Apply transforms on all export objects:
   - Select object
   - Ctrl+A > All Transforms
3. File > Export > glTF 2.0
4. Export settings:
   - Format: glTF Binary (.glb)
   - Include: Selected Objects (if you selected only fountain)
   - Include Materials: enabled
   - Include Animations: enabled (if animated)
5. Save as something like fountain_realistic_v1.glb

## Part G: Quick import checklist for your web game

1. Put GLB file in your project asset folder.
2. Load with GLTFLoader in Three.js.
3. Set scale and position in scene.
4. If animation exists, play it with AnimationMixer.
5. Add a subtle point light or reflection source so water reads better.

## Beginner mistakes to avoid

1. Water plane exactly at rim height (looks fake). Keep it slightly below.
2. Top ring without support geometry (looks floating). Always add a neck/support piece.
3. Overly bright water color everywhere. Keep center darker, edge slightly lighter.
4. Too much animation speed. Slow movement is usually more realistic.
5. Exporting without applying transforms, causing weird scale/rotation in game.

## Suggested learning order

1. Build static stone fountain first.
2. Add bowl water surfaces.
3. Add stream curves.
4. Add materials.
5. Add animation only after shape looks right.
6. Export GLB and test in game.

## If you get stuck

Use this exact decision flow:

1. Shape looks wrong:
   - Fix geometry first, do not touch materials yet.
2. Looks flat:
   - Improve lighting and material roughness/normal detail.
3. Water looks fake:
   - Darken base water, reduce motion speed, add edge highlights only.
4. Ring looks floating:
   - Add a solid support cylinder under ring and reconnect proportions.

You are on the right path. For your project, the biggest win is building the stone fountain and water streams as separate meshes in Blender, then importing as GLB so the form is truly 3D in-game.
