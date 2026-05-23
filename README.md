# Haein Oh Portfolio

Portfolio site for Haein Oh, a gameplay programmer focused on rapid prototyping, live-service iteration, and player-first game feel.

Production: https://haeinoh.vercel.app

## Profile

I build gameplay systems, mobile live-service features, prototypes, and developer-facing tools. My work tends to sit between fast implementation and practical production stability: getting a feature playable quickly, then improving the parts that affect players, teams, and release quality.

## Professional Experience

### Halfbrick Studios

Gameplay Programmer

- Contributed to Jetpack Joyride Racing feature development and launch work.
- Worked across the Halfbrick+ HubApp ecosystem.
- Supported mobile live-service stability through QA, Crashlytics, dogfooding, bug fixing, and SDK maintenance.
- Worked with an international team on live issue response and production troubleshooting.

### 111%

Game Client Programmer

- Designed and implemented 70+ achievement systems.
- Built combat, boss, skin, augment, event, and live-service content systems.
- Worked with Unity, Firebase, Jenkins, Git, Redmine, and rapid prototyping workflows.

## Selected Projects

### Moai Wanna Slam

Solo project built with Lua / LÖVE.

- Investigated and improved Android multiplayer lag.
- Resolved shader/rendering differences across iOS, APK, and PC builds.
- Built a DDQN-based battle bot.

### Necro Rumble

KRAFTON Jungle Game Lab team project.

- Steam release with 40K+ copies sold.
- Designed and implemented core unit, skill, combat, and AI systems.
- Refactored AI structure from FSM toward Behavior Tree patterns.

Links:
- Steam: https://store.steampowered.com/app/2735950/Necro_Rumble/
- GitHub: https://github.com/badarang/NecroRumble

### Animal Jumping!

Solo mobile project developed through Smilegate Membership and showcased at Burning Beaver.

- Built 1v1 multiplayer with Backnd Match.
- Integrated AdMob and IAP.
- Reduced GC pressure through pooling and preset caching.
- The Google Play listing is no longer active, so current references use the press/interview links and source sample instead.

Links:
- Press: https://www.pinpointnews.co.kr/news/articleView.html?idxno=305741
- GitHub sample: https://github.com/badarang/AnimalJumping_Sample

## Writing

The site includes development posts and retrospectives, including:

- Unity DOTS notes
- Shader and rendering breakdowns
- Animal Jumping feedback analysis
- Burning Beaver exhibition retrospective

Blog index: https://haeinoh.vercel.app/blog

## Site Stack

- React 18
- Vite 5
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber
- Supabase for blog content

## Local Development

```bash
npm install
npm run dev
npm run build
```

Optional Supabase environment variables:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Publishing scripts use service-role credentials from `.env.publish`, which should not be committed.

