const tools = [
  { name: "Unity", icon: "https://cdn.simpleicons.org/unity/ffffff" },
  { name: "C#", mark: "C#" },
  { name: "Unreal Engine", icon: "https://cdn.simpleicons.org/unrealengine/ffffff" },
  { name: "GameMaker", icon: "https://cdn.simpleicons.org/gamemaker/00A4A6" },
  { name: "Lua", icon: "https://cdn.simpleicons.org/lua/5B6CFF" },
  { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
  { name: "Firebase", icon: "https://cdn.simpleicons.org/firebase/FFCA28" },
  { name: "Jenkins", icon: "https://cdn.simpleicons.org/jenkins/D24939" },
  { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
  { name: "Perforce", icon: "https://cdn.simpleicons.org/perforce/404040" },
];

function ToolBadge({ item }) {
  return (
    <li className="tech-loop__item">
      <span className="tech-loop__logo" aria-hidden>
        {item.icon ? (
          <img src={item.icon} alt="" loading="lazy" />
        ) : (
          <span>{item.mark}</span>
        )}
      </span>
      <span>{item.name}</span>
    </li>
  );
}

export default function TechLogoLoop() {
  return (
    <section className="container-px py-8 sm:py-10" aria-label="Tools and technology">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-simple">
          Tools I Use
        </p>
        <p className="text-sm font-medium text-muted">
          Engines, pipelines, and live-service tools I can move with.
        </p>
      </div>

      <div className="tech-loop" role="list">
        <ul className="tech-loop__track">
          {tools.map((item) => (
            <ToolBadge item={item} key={item.name} />
          ))}
          {tools.map((item) => (
            <ToolBadge item={item} key={`${item.name}-duplicate`} />
          ))}
        </ul>
      </div>
    </section>
  );
}
