# AI Video Generation Guide for Fur Eliza
## Luxury Perfume Bottle Videos — Prompts, Techniques & Settings

> Last updated: 2026-04-02
> Research scope: Kling 3.0, Runway Gen-4/4.5, Veo 3/3.1, Sora 2

---

## Table of Contents

1. [Prompt Engineering Framework](#1-prompt-engineering-framework)
2. [Camera Movement Dictionary](#2-camera-movement-dictionary)
3. [Lighting & Material Vocabulary](#3-lighting--material-vocabulary)
4. [Negative Prompts](#4-negative-prompts)
5. [7 Perfume Bottle Prompt Templates](#5-seven-perfume-bottle-prompt-templates)
6. [Viral / Impact Techniques](#6-viral--impact-techniques)
7. [Technical Settings by Model](#7-technical-settings-by-model)
8. [Image-to-Video Workflow](#8-image-to-video-workflow)
9. [Post-Production Tips](#9-post-production-tips)
10. [Sources](#10-sources)

---

## 1. Prompt Engineering Framework

### The 5-Layer Structure (VO3 AI Method)

Every prompt should follow these layers in order:

| Layer | Purpose | Example |
|-------|---------|---------|
| **1. Camera Direction** | Movement type + speed | "Slow dolly push toward..." |
| **2. Subject Anchoring** | Ground the product in physical space | "...a frosted glass perfume bottle, centered on a white marble pedestal, catching soft golden light from the upper left" |
| **3. Lighting & Atmosphere** | Light direction, quality, mood | "...warm key light from upper right, hazy volumetric mist" |
| **4. Motion Choreography** | What moves vs. what stays still | "The bottle remains perfectly still while wisps of golden smoke drift slowly around it from below" |
| **5. Style & Reference** | Cinematic anchor | "Shot on 35mm with shallow depth of field, luxury commercial aesthetic" |

### The 8-Part Veo 3 Framework

For Veo 3 specifically, expand to 8 components:

1. **Scene** — Clear action/vibe
2. **Visual style** — Cinematic, realistic, surreal
3. **Camera movement** — Static, pan, tracking, aerial
4. **Main subject** — Focus details
5. **Background** — Setting/era context
6. **Lighting and mood** — Emotional tone through lighting
7. **Audio cue** — Music, ambience, sound effects (Veo 3 generates audio natively)
8. **Color palette** — Overall color scheme guidance

### Kling 3.0 Prompt Order

Write prompts in this exact order: **Scene > Subject > Action > Camera > Audio & Style**

Kling 3.0 understands cinematic intent, not just visual descriptions. Write prompts like directions to a scene, not a list of objects.

### Key Rules

- **One camera movement per prompt.** "Dutch angle whip pan with rack focus during a crane shot" = confused output. Pick one primary + one subtle secondary axis max.
- **Never redescribe the image in image-to-video mode.** Only add motion instructions.
- **Be specific with motion.** "Add movement" = useless. "Hair flowing gently in the wind" = actionable.
- **Place camera instructions near the beginning** for more reliable results (Kling 3.0).
- **Keep scenes simple.** The biggest mistake is cramming an entire film into one prompt.

### Ready-to-Use Master Template

```
Cinematic [CAMERA_MOVEMENT] toward [PRODUCT_DESCRIPTION] centered on [SURFACE],
lit by [LIGHT_DESCRIPTION]. [ATMOSPHERIC_ELEMENT] drifts through the frame.
[MOTION_INSTRUCTION]. Shot on 35mm with shallow depth of field,
[STYLE_REFERENCE] aesthetic, [ASPECT_RATIO].
```

---

## 2. Camera Movement Dictionary

### Primary Movements (Proven in AI Video)

| Movement | Definition | Best For | Prompt Phrasing |
|----------|-----------|----------|-----------------|
| **Push-in (Dolly In)** | Camera moves toward subject | Highlighting product features, increasing intensity | "Slow push in, intimate pace, light glinting off glass" |
| **Pull-back (Dolly Out)** | Camera moves backward revealing context | Hero reveals, ending scenes | "Pull back, steady reveal, showing the surrounding environment" |
| **Orbit / Arc** | Camera circles around subject while keeping them centered | Hero shots, product showcases, 360 displays | "Orbit clockwise, smooth cinematic pace, circling the bottle, light reflections shifting on glass" |
| **Crane / Boom** | Camera sweeps up and away from a high vantage point | Epic establishing shots, dramatic reveals | "Crane up, sweeping grandiose pace, revealing the product setting" |
| **Pan (Left/Right)** | Camera swivels horizontally from fixed point | Following action, revealing wide scenes | "Pan right, smooth speed, following the light path across the bottle" |
| **Tilt (Up/Down)** | Camera angles up or down from fixed point | Emphasizing height, revealing full product | "Tilt up, slow majestic pace, revealing the bottle top against dark background" |
| **Tracking Shot** | Follows moving subject at matching speed | Action, dynamic sequences | "Tracking shot, smooth pace, following the mist flow" |
| **Truck (Left/Right)** | Entire camera moves parallel to subject | Scanning product details | "Truck left, consistent pace, scanning details along the bottle surface" |
| **Pedestal (Up/Down)** | Camera physically moves up/down like an elevator | Revealing hidden elements | "Pedestal up, slow reveal, rising to show the bottle cap and label" |
| **Static (Locked-off)** | Camera remains motionless | Subtle details, atmospheric shots | "Static shot, natural pace, steam rising steadily, light shifting" |
| **Rack Focus** | Focus shifts from foreground to background | Shifting attention between elements | "Rack focus, gentle transition, shifting sharpness from petals to bottle" |
| **Crash Zoom** | Very fast dramatic zoom into subject | Hook shots, shocking reveals | "Crash zoom, lightning fast, snapping to the logo detail" |

### Prompt Formula for Camera

```
[Camera direction] + [Scene pace] + [Action/motion] + [Atmospheric details]
```

### Multi-Axis Layering (Advanced)

Choose ONE primary axis (e.g., dolly forward) + ONE subtle secondary (e.g., "slight left-to-right drift" or "gentle arc around the subject"). Keep everything else steady.

---

## 3. Lighting & Material Vocabulary

### Lighting Terms That AI Models Understand

| Term | Effect | When to Use |
|------|--------|-------------|
| **Rim light** | Thin bright edge around subject | Separating bottle from dark background |
| **Key light** | Main light source | Primary illumination direction |
| **Soft diffused light** | Even, shadowless illumination | Clean luxury product shots |
| **Volumetric light** | Visible light beams/rays through atmosphere | Dramatic, atmospheric mood |
| **Golden hour** | Warm orange-gold tones | Romantic, premium feeling |
| **Butterfly lighting** | Light directly above, casting shadow under nose/chin | Beauty, elegance |
| **Softbox / studio lighting** | Professional even light | Commercial product shots |
| **Backlight / backlighting** | Light behind subject | Silhouettes, glass transparency |
| **Three-point lighting** | Key + fill + back | Professional studio look |
| **Caustics** | Light patterns from refraction through glass/water | Glass bottles with liquid |
| **Specular highlights** | Bright reflection spots on glossy surfaces | Glass, metal, polished surfaces |
| **Color temperature** | Warm 3200K / Cool 5600K | Intimate vs. professional mood |
| **High-contrast / chiaroscuro** | Strong light-dark interplay | Dramatic, mysterious luxury |

### Glass & Bottle Material Terms

| Term | What It Describes |
|------|-------------------|
| **Fresnel effect** | Reflections strengthen at grazing angles on glass |
| **Refraction** | Light bending through transparent glass |
| **Prismatic glints** | Rainbow-like light splitting through facets |
| **Specular reflections** | Sharp bright spots on polished glass |
| **Internal refractions** | Light patterns visible inside the liquid |
| **Glossy finish** | Mirror-like surface quality |
| **Frosted glass** | Matte translucent surface |
| **Clean reflections** | No distortion in mirror surfaces |
| **Soft Fresnel effect on edges** | Gentle edge glow on glass |
| **Crystal-clear glass with perfect transparency** | Ultra-clean glass rendering |
| **Physically accurate light refraction** | Realistic light behavior through glass |

### Specular Highlight Control (Advanced)

From the HailuoAI guide:
- Combine "soft glow" with "specular" rather than "extremely shiny" to avoid highlight clipping
- Anchor material specifically: "Polished 24k gold cap" not "shiny metal"
- Define primary light type: key light, rim light, butterfly lighting
- Add quality modifier: "soft glow" prevents blown-out highlights
- Use the **Primary Source First Heuristic**: describe environment/light BEFORE highlight placement

### Atmospheric Effect Terms

| Effect | Prompt Phrasing |
|--------|-----------------|
| **Smoke/mist** | "Wisps of golden smoke drift slowly from below" |
| **Falling petals** | "Rose petals falling gently around it in slow motion" |
| **Water droplets** | "Tiny water droplets slide down the bottle surface" |
| **Particle dust** | "Golden particles floating around it" |
| **Light flares** | "Light glinting off glass, subtle lens flare" |
| **Fog** | "Soft fog in background for depth" |
| **Bokeh** | "Soft bokeh background with circular light patterns" |

---

## 4. Negative Prompts

### Universal Product Video Negatives

```
blurry, low resolution, pixelated, compression artifacts, distorted motion,
flickering, frame drops, shaky, noise, watermark, text overlay, logo,
cartoon, anime, illustration, painting, oversaturated, artificial,
computer-generated, synthetic, plastic, uncanny valley, overly smooth
```

### Glass Bottle Specific Negatives

```
dents, scratches, fingerprints, dust, reflections of camera, text morphing,
warping, morphing, inconsistent physics, floating objects, unnatural movements,
background shifting, face distortion, extra elements, cluttered background,
busy background, distracting elements, chaotic, excessive detail
```

### Motion-Specific Negatives

```
jitter, flicker, stutter, motion tearing, rolling shutter wobble,
warping, morphing, sliding, drifting, unstable, choppy
```

### Best Practices for Negative Prompts

- Focus on **stability and consistency**, not general quality words
- Strengthen positives rather than adding more negatives
- Keep composition tight to reduce text/logo morphing
- Use negatives strategically, not as a quality blanket

---

## 5. Seven Perfume Bottle Prompt Templates

### Template 1: Hero Reveal (Dramatic Entrance)

**Concept:** Bottle emerges from darkness with dramatic lighting.

```
Spotlight glides slowly across a crystal perfume bottle on a velvet-black surface.
Begin with a crane shot descending from complete darkness to product level.
High-contrast rim lighting with dramatic golden highlights from upper right.
Soft fog drifts in the background for depth. The bottle catches light sequentially
as the camera descends, revealing facets and the gold "Fur Eliza" label.
Shot on 35mm film, shallow depth of field, luxury Dior commercial aesthetic, 16:9.
```

**Model:** Kling 3.0 (best glass refraction) or Veo 3.1 (best cinematic feel)
**Settings:** 4K, 24fps, 10 seconds, 16:9
**Negative:** `blurry, warping, text morphing, flickering, cartoon, cluttered background`
**Expected:** Dramatic cinematic reveal where light progressively unveils the bottle against pure darkness. High-end fragrance commercial quality.

---

### Template 2: 360-Degree Showcase (Turntable)

**Concept:** Smooth orbital rotation showing all angles.

```
Elegant dark glass perfume bottle with gold accents rotating slowly on a polished
black marble pedestal. Smooth 360-degree orbit shot at eye level. Soft spotlight
from above with subtle warm rim light from behind creating clean surface reflections
and a soft Fresnel effect on edges. Rose petals scattered on the marble surface.
Black background, commercial photography style, photorealistic, 4K quality.
```

**Model:** Kling 3.0 (native 4K, best for smooth rotation)
**Settings:** 4K, 30fps, 10-15 seconds, 1:1 or 16:9
**Negative:** `jitter, stutter, warping, morphing, inconsistent lighting, text morphing, fingerprints, dust`
**Expected:** Smooth, uninterrupted 360-degree rotation with consistent lighting and zero jitter. E-commerce showcase quality.

---

### Template 3: Macro Detail (Notes Visualization)

**Concept:** Extreme close-up with olfactory notes materializing as physical elements.

```
Extreme macro close-up of a luxury perfume bottle's glass surface.
Slow push-in revealing microscopic details of the crystal facets.
Delicate rose petals, cardamom pods, and wisps of vanilla smoke drift
into frame from the edges. Rack focus shifts from petals in foreground
to the golden liquid visible through the glass. Warm key light from upper left
with caustic light patterns dancing on the surface. Shallow depth of field,
luxury brand macro photography, photorealistic, 4K quality.
```

**Model:** Runway Gen-4.5 (superior physics) or Kling 3.0
**Settings:** 4K, 24fps, 10 seconds, 16:9
**Negative:** `blurry, extra objects, cluttered, fingerprints, dust, warping, morphing`
**Expected:** Ultra-detailed macro footage where botanical and spice elements representing fragrance notes appear alongside the bottle, creating a sensory visual narrative.

---

### Template 4: Lifestyle / Mood (Emotional Atmosphere)

**Concept:** The feeling and world the fragrance evokes.

```
A dark glass perfume bottle resting on weathered leather-bound books
beside a crackling fireplace. Warm amber firelight creates dancing
golden reflections on the bottle surface. Wisps of aromatic smoke
curl upward in slow motion. Camera performs a gentle dolly-in
from medium shot to close-up. Shallow depth of field with soft bokeh
from fire in background. Moody, intimate, Colombian evening atmosphere.
Rich browns, deep golds, warm amber color palette. Luxury editorial style.
```

**Model:** Veo 3.1 (best atmospheric/cinematic) with native audio (fire crackling)
**Settings:** 1080p, 24fps, 10 seconds, 16:9 or 9:16 vertical for social
**Negative:** `cartoon, oversaturated, bright, clinical, sterile, cluttered, multiple products`
**Expected:** Warm, intimate atmospheric shot that communicates the emotional world of the fragrance. Editorial magazine quality with a moody, sophisticated ambiance.

---

### Template 5: Transformation / Artistic (Morphing Elements)

**Concept:** Bottle transforms or emerges from natural elements.

```
A cascade of dark liquid gold flowing in slow motion, gradually
coalescing and solidifying into the form of a luxury perfume bottle.
As the bottle takes shape, rose petals and fragments of oud wood orbit
around it, caught in the liquid flow. Camera performs a slow orbit
as the transformation completes. Volumetric golden light from behind.
Black background with subtle smoke. Surreal, artistic, high-fashion
perfume commercial aesthetic. Smooth liquid movement, photorealistic, 4K.
```

**Model:** Kling 3.0 (best liquid movement) or Sora 2 (best physical simulation)
**Settings:** 4K, 24fps, 10-15 seconds, 16:9
**Negative:** `jerky, sudden cuts, inconsistent physics, flickering, warping, low resolution`
**Expected:** A mesmerizing liquid-to-solid transformation where the bottle materializes from flowing gold. Artistic, shareable, high viral potential.

---

### Template 6: Floating / Impossible Physics (Social Media Hook)

**Concept:** Bottle defying gravity with magnetic visual pull.

```
A dark luxury perfume bottle floating and slowly rotating in mid-air
against a pure black background. Golden particles of light orbit around
the bottle like a constellation. The bottle's glass surface catches
and refracts the particle light, creating prismatic glints.
Camera performs a slow push-in from medium to close-up.
Dramatic side lighting with soft rim light creating clean reflections.
Zero gravity, ethereal, futuristic luxury aesthetic, photorealistic, 4K.
```

**Model:** Sora 2 (best impossible physics) or Kling 3.0
**Settings:** 4K, 30fps, 5-10 seconds, 9:16 (vertical for TikTok/Reels)
**Negative:** `ground, surface, table, shadows on floor, warping, morphing, cartoon, jitter`
**Expected:** Eye-catching gravity-defying hero shot. Perfect for social media hooks. The first 3 seconds dictate 71% of retention — this format captures immediately.

---

### Template 7: Water / Submersion (Sensory Immersion)

**Concept:** Bottle interacting with water for a premium sensory experience.

```
A luxury perfume bottle slowly sinking into deep, crystal-clear
dark blue water. Sunlight shafts penetrate from above, creating
caustic light patterns that dance across the glass surface.
Tiny air bubbles rise from the bottle in slow motion.
The golden liquid inside the bottle catches the refracted underwater light.
Camera tracks the descent with a smooth dolly-down movement.
Macro detail of water surface tension breaking. Premium aquatic luxury,
slow motion, photorealistic, 4K quality.
```

**Model:** Kling 3.0 (best liquid dynamics) or Veo 3.1
**Settings:** 4K, 60fps (for slow-motion extraction), 10 seconds, 16:9
**Negative:** `murky water, dirty, bubbles too large, warping, morphing, flickering, fast movement`
**Expected:** Hypnotic underwater sequence with stunning caustic light play on glass. Excellent for aquatic/fresh fragrance lines. High production value feel.

---

## 6. Viral / Impact Techniques

### What Makes AI Video Go Viral

Based on 2026 data, the critical success factors:

1. **Hook in first 3 seconds** — Bold visual contrast, curiosity trigger, impossible visual. The first 3 seconds dictate 71% of retention success ("Hook Engineering").
2. **Single transformation moment** — One clear "wow" that is immediately shareable.
3. **Satisfying physics** — Liquid movement, smooth rotation, particle effects trigger dopamine.
4. **Impossible-but-believable** — Floating objects, liquid morphing, scale shifts.
5. **Macro-to-wide transitions** — Starting extremely close then pulling back to reveal context.

### High-Impact Effect Categories

| Effect | Virality Score | Description |
|--------|---------------|-------------|
| **Liquid morphing** | Very High | Object forms from or dissolves into liquid |
| **Impossible gravity** | Very High | Floating, orbiting, zero-G product showcase |
| **Scale transition** | High | Macro detail to wide establishing shot in one clip |
| **Speed ramping** | High | Slow motion with sudden speed burst (use 60fps source) |
| **Particle formation** | High | Thousands of particles assembling into product shape |
| **Material transformation** | High | Gold liquid solidifying, smoke forming shapes |
| **Freeze-frame rotation** | Medium-High | Time stops, camera orbits, then time resumes |
| **Nature integration** | Medium | Botanical elements (flowers, spices) emerging organically |
| **Water interaction** | Medium | Submersion, splash, droplet macro |

### Social Platform Optimization

| Platform | Format | Duration | Key Technique |
|----------|--------|----------|---------------|
| **TikTok** | 9:16 vertical | 5-15 sec | Hook in 1 sec, transformation at 3 sec |
| **Instagram Reels** | 9:16 vertical | 5-30 sec | Satisfying loop, aesthetic consistency |
| **YouTube Shorts** | 9:16 vertical | 15-60 sec | Story arc, product at center throughout |
| **Website hero** | 16:9 landscape | 5-10 sec | Seamless loop, ambient mood |
| **Product page** | 1:1 or 16:9 | 5-10 sec | 360 showcase, detail focus |

### Multi-Shot Storyboard (Kling 3.0 Exclusive)

Kling 3.0 supports up to 6 shots in a single generation. Example storyboard:

```
Shot 1: Extreme close-up of bottle cap detail, soft focus background. 2 seconds.
Shot 2: Slow pull-back revealing full bottle on marble surface. 3 seconds.
Shot 3: Orbit shot 90 degrees showing label and glass facets. 3 seconds.
Shot 4: Rack focus from bottle to rose petals in foreground. 2 seconds.
Shot 5: Push-in to liquid inside bottle, golden light refracting. 3 seconds.
Shot 6: Wide pull-back, mist filling frame, bottle silhouette. 2 seconds.
```

---

## 7. Technical Settings by Model

### Kling 3.0

| Setting | Recommended Value |
|---------|------------------|
| **Resolution** | 4K native (3840x2160) |
| **Frame rate** | 24fps (cinematic), 30fps (web), 60fps (speed ramping in post) |
| **Max duration** | 15 seconds (standard), 5 minutes (avatar mode) |
| **Aspect ratios** | 16:9, 9:16, 1:1 |
| **Multi-shot** | Up to 6 shots per generation |
| **Audio** | Native output, multilingual, dialect support |
| **Best for** | Glass refraction, liquid movement, 360 rotation, 4K product showcase |
| **Image-to-video** | Preserves text, signage, visual identity while adding motion |

### Runway Gen-4.5

| Setting | Recommended Value |
|---------|------------------|
| **Resolution** | 1080p HD |
| **Frame rate** | Up to 60fps |
| **Max duration** | 60 seconds |
| **Aspect ratios** | Multiple supported |
| **Audio** | Native audio (since Dec 2025) |
| **Best for** | Physics accuracy, character consistency, stylized/VFX content |
| **Post-production** | 30+ Magic Tools built in (slow motion, color grading, object erasing) |
| **Cost** | $0.20-0.50/second |

### Veo 3.1

| Setting | Recommended Value |
|---------|------------------|
| **Resolution** | 1080p HD |
| **Frame rate** | 24fps, 30fps, or 60fps |
| **Max duration** | 60 seconds |
| **Aspect ratios** | 16:9, 9:16 |
| **Audio** | Industry-leading native audio with perfect sync |
| **Best for** | Cinematic realism, film grain, professional color grading, atmospheric content |
| **Cost** | $0.15-0.40/second |

### Sora 2

| Setting | Recommended Value |
|---------|------------------|
| **Resolution** | 1080p |
| **Frame rate** | Variable |
| **Max duration** | 20 seconds (extends to 60s) |
| **Audio** | Native audio with lip-sync |
| **Best for** | Physical world simulation, impossible physics, abstract/fantasy content |
| **Cost** | $0.10-0.50/second |
| **Limitation** | US/Canada only availability |

### Model Selection Guide for Fur Eliza

| Use Case | Primary Model | Backup Model |
|----------|--------------|--------------|
| 360 product turntable | Kling 3.0 | Runway Gen-4.5 |
| Dramatic hero reveal | Veo 3.1 | Kling 3.0 |
| Liquid/water effects | Kling 3.0 | Sora 2 |
| Atmospheric mood piece | Veo 3.1 | Runway Gen-4.5 |
| Impossible physics/floating | Sora 2 | Kling 3.0 |
| Transformation/morphing | Kling 3.0 | Sora 2 |
| Social media vertical | Any (generate at 9:16) | - |
| Website hero loop | Veo 3.1 | Runway Gen-4.5 |

---

## 8. Image-to-Video Workflow

### Optimal Pipeline

1. **Create a high-quality keyframe** (source image)
   - Use PNG or high-quality JPG at maximum resolution
   - Ensure the product is well-lit, centered, and sharp
   - Avoid heavily compressed images (AI amplifies artifacts)

2. **Select the model based on the goal**
   - Product rotation: Kling 3.0
   - Cinematic atmosphere: Veo 3.1
   - Physical effects: Sora 2

3. **Write a motion-only prompt** (never redescribe the image)
   - WRONG: "A dark perfume bottle on marble with gold light..."
   - RIGHT: "Slow orbit clockwise, bottle catches light sequentially, wisps of smoke drift from below"

4. **Generate multiple outputs and select the best**
   - Always generate 3-5 variations
   - Select for: stable product rendering, no morphing, smooth motion

5. **Post-production polish**
   - Color grading, cropping, looping, speed adjustments

### Master Reference Technique

Generate one high-fidelity static image with perfect lighting and reflections, then use it as anchor for ALL subsequent video clips with identical lighting descriptions. This ensures visual consistency across your content library.

### Image Quality Checklist

- [ ] Resolution: minimum 2048px on longest edge
- [ ] Format: PNG (lossless) preferred over JPG
- [ ] Product centered in frame with breathing room
- [ ] Clean, uncluttered background
- [ ] Consistent, professional lighting
- [ ] No visible compression artifacts
- [ ] Text/logo clearly rendered and stable

---

## 9. Post-Production Tips

### Speed Ramping Workflow

1. Generate at **60fps** in Kling 3.0
2. Conform to **24fps** timeline in editing software
3. You now have 2.5x slow motion available
4. Speed ramp: normal speed > slow motion at impact moment > normal speed
5. Add sound design: swoosh for speed changes, bass hit for slow-mo moment

### Seamless Looping (Website Heroes)

1. Generate a 10-second clip
2. Find a matching start/end frame (usually dark/mist moments)
3. Create a 1-second cross-dissolve at the loop point
4. Export as WebM or MP4 for web embedding
5. Use `<video autoplay muted loop playsinline>` in HTML

### Color Grading for Dark Luxury

- Lift shadows slightly (never pure black — aim for #0a0a0a)
- Add warm gold tone to highlights (matching Fur Eliza brand)
- Desaturate midtones for sophisticated feel
- Increase contrast in glass/specular areas
- Add subtle film grain for organic texture

### Multi-Clip Editing Strategy

1. Generate 5-7 clips from different templates
2. Select the best 3-4 clips
3. Cut to music/sound design
4. Maintain consistent color grade across all clips
5. Add subtle transitions (dissolve, not hard cuts for luxury)
6. End with logo/brand card

---

## 10. Sources

### Prompt Engineering Guides
- [Kling 3.0 Prompting Guide (fal.ai)](https://blog.fal.ai/kling-3-0-prompting-guide/)
- [Kling 3.0 Prompt Guide (klingaio.com)](https://klingaio.com/blogs/kling-3-prompt-guide)
- [Gen-4 Video Prompting Guide (Runway)](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide)
- [Runway Gen-4 Prompts (filmart.ai)](https://filmart.ai/runway-gen-4-prompts/)
- [Veo 3 Prompt Examples (Powtoon)](https://www.powtoon.com/blog/veo-3-video-prompt-examples/)
- [Google DeepMind Veo Prompt Guide](https://deepmind.google/models/veo/prompt-guide/)
- [AI Video Prompt Engineering: 5-Layer Framework (VO3 AI)](https://www.vo3ai.com/blog/how-to-write-one-prompt-ai-videos-that-keep-products-in-frame-2026-technique-bre-2026-03-21)
- [10 Prompt Pillars for Realistic AI Video (Magic Hour)](https://magichour.ai/blog/realistic-ai-video-prompting)

### Camera Movements
- [12 Essential Camera Movements (LetsEnhance)](https://letsenhance.io/blog/all/ai-video-camera-movements/)
- [42 Camera Movements for AI Prompts (AI Shot Studio)](https://aishotstudio.com/42-camera-movements-ai-prompts/)
- [38 Prompts for Cinematic AI Camera Moves (Atlabs)](https://www.atlabs.ai/blog/ultimate-guide-ai-camera-moves-prompts)
- [Camera Terms & Examples (Runway)](https://help.runwayml.com/hc/en-us/articles/47313504791059-Camera-Terms-Prompts-Examples)

### Luxury & Perfume Specific
- [AI Perfume Image Prompts (PromptPV)](https://promptpv.com/ai-image-prompts-for-perfume-advertisement-2025/)
- [AI Fragrance Commercials (e-uphoria)](https://www.e-uphoria.com/fragments/ai-fragrance-commercial-examples-cinematic-direction-for-perfume-brands)
- [Specular Highlights for Luxury AI Video (HailuoAI)](https://hailuoai.video/pages/knowledge/specular-highlights-luxury-ai-video-guide)
- [Dior Sauvage AI Concept (RatedG)](https://ratedg.ai/stream/videos/dior-sauvage-reimagined-ai-generated-fragrance-commercial-concept-2025/)

### Technical Comparisons
- [AI Video Model Comparison 2026 (RizzGen)](https://rizzgen.ai/blogs/runway-kling-veo-sora-ltx-wan-seedance-comparison)
- [Kling 3.0 vs Veo 3 API (ModelsLab)](https://modelslab.com/blog/video-generation/kling-3-veo-3-runway-ai-video-api-comparison-2026)
- [Best AI Video Generators 2026 (Zapier)](https://zapier.com/blog/best-ai-video-generator/)
- [Runway Gen-4 vs Kling 3.0 (Atlas Cloud)](https://www.atlascloud.ai/blog/guides/runway-gen-4-vs-kling-3-0-which-image-to-video-ai-wins-for-professional-filmmaking)

### Viral & Social Media
- [25 Best Kling 3.0 Prompts (Vofy)](https://www.vofy.art/blog/best-kling-3-0-prompts)
- [50+ AI Video Prompts (Seedance)](https://www.seedance.tv/blog/best-ai-video-prompts)
- [Sora 2 Viral Video Prompts (God of Prompt)](https://www.godofprompt.ai/blog/sora-2-viral-video-prompts)
- [How to Make AI Videos Go Viral (VidWave)](https://vidwave.ai/how-to-make-ai-videos-go-viral-on-social-media-in-2026)

### Negative Prompts & Effects
- [Negative Prompts Guide (LTX Studio)](https://ltx.studio/blog/negative-prompts)
- [Kling AI Best Negative Prompts (Pollo AI)](https://pollo.ai/hub/kling-ai-best-negative-prompts)
- [AI Video Effects 2026 (StarryAI)](https://starryai.com/en/blog/ai-video-effects)

### Image-to-Video Workflow
- [Complete Image-to-Video Guide 2026 (Hedra)](https://www.hedra.com/blog/image-to-video-ai-guide)
- [Best Image-to-Video AI Tools 2026 (LetsEnhance)](https://letsenhance.io/blog/all/best-ai-video-generators/)
- [Best Image-to-Video AI 2026 (Atlas Cloud)](https://www.atlascloud.ai/blog/guides/10-best-image-to-video-ai-tools-in-2026-from-static-photos-to-cinematic-masterpieces)
