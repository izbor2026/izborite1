import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const parties = [
  {
    name: "ГЕРБ-СДС",
    short: "ГЕРБ-СДС",
    type: "coalition",
    logoText: "ГС",
    logoClass: "bg-emerald-600 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/percoal",
    officialProgramUrl: null,
    officialWebsite: null,
    infoStatus: "full",
    economy: "Подкрепа за бизнес средата, инфраструктурни проекти и стабилни публични финанси.",
    healthcare: "Модернизация на болниците и дигитализация на здравеопазването.",
    education: "Инвестиции в образование, дигитални умения и връзка между образование и бизнес.",
    eu: "Силна подкрепа за членството в ЕС и по-дълбока интеграция.",
    russia: "Подкрепа за общата европейска политика спрямо Русия.",
    nato: "Подкрепа за евроатлантическата ориентация и сътрудничество в рамките на НАТО.",
    energy: "Подкрепа за енергийна диверсификация, инфраструктура и прагматично развитие на сектора.",
    migration: "Подкрепа за по-строг контрол по границите и координация с европейските партньори.",
    taxes: "Запазване на плоския данък.",
    profile: { taxes: "low", eu: "pro", russia: "far", state: "medium" }
  },
  {
    name: "БСП – ОБЕДИНЕНА ЛЕВИЦА",
    short: "БСП-ОЛ",
    type: "coalition",
    logoText: "БЛ",
    logoClass: "bg-red-600 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/percoal",
    officialProgramUrl: null,
    officialWebsite: null,
    infoStatus: "full",
    economy: "По-активна роля на държавата в икономиката и защита на социалните политики.",
    healthcare: "По-голямо публично финансиране и достъпно здравеопазване.",
    education: "Повишаване на заплатите на учителите и подкрепа за държавното образование.",
    eu: "Подкрепа за членството в ЕС, но с акцент върху защита на националния интерес.",
    russia: "По-прагматични и по-близки икономически отношения с Русия.",
    nato: "Подкрепа за сигурността на страната с акцент върху националния интерес и предпазлив подход към външнополитически ангажименти.",
    energy: "Подкрепа за по-силна роля на държавата в енергетиката и защита на потребителите.",
    migration: "Подкрепа за контролирана миграционна политика и защита на социалната система.",
    taxes: "По-голямо преразпределение и идеи за по-прогресивно облагане.",
    profile: { taxes: "high", eu: "skeptic", russia: "close", state: "high" }
  },
  {
    name: "ПРОДЪЛЖАВАМЕ ПРОМЯНАТА – ДЕМОКРАТИЧНА БЪЛГАРИЯ",
    short: "ПП-ДБ",
    type: "coalition",
    logoText: "ПД",
    logoClass: "bg-indigo-600 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/percoal",
    officialProgramUrl: null,
    officialWebsite: null,
    infoStatus: "full",
    economy: "Подкрепа за иновации, дигитална икономика и прозрачна бизнес среда.",
    healthcare: "Реформи в управлението на здравната система и дигитализация.",
    education: "Инвестиции в образование, технологии и развитие на човешкия капитал.",
    eu: "Силно проевропейска позиция и подкрепа за интеграция в ЕС и еврозоната.",
    russia: "Критична позиция към руското влияние и подкрепа за европейските санкции.",
    nato: "Подкрепа за евроатлантическата ориентация и засилване на институционалната устойчивост в сферата на сигурността.",
    energy: "Подкрепа за диверсификация, прозрачност и модернизация на енергийния сектор.",
    migration: "Подкрепа за ефективен граничен контрол и европейска координация по миграционните политики.",
    taxes: "Запазване на данъчната система с фокус върху по-добра събираемост.",
    profile: { taxes: "medium", eu: "pro", russia: "far", state: "medium" }
  },
  {
    name: "ДВИЖЕНИЕ ЗА ПРАВА И СВОБОДИ",
    short: "ДПС",
    type: "party",
    logoText: "Д",
    logoClass: "bg-cyan-600 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
    officialProgramUrl: null,
    officialWebsite: null,
    infoStatus: "full",
    economy: "Подкрепа за бизнес стабилност, инвестиции и регионално развитие.",
    healthcare: "По-добър достъп до здравни услуги в регионите и модернизация на сектора.",
    education: "Подкрепа за образование, квалификация и регионални възможности за младите.",
    eu: "Подкрепа за членството в ЕС и прагматичен проевропейски курс.",
    russia: "По-прагматичен и умерен подход, без отклонение от евроатлантическата рамка.",
    nato: "Подкрепа за предвидима политика по сигурността в рамките на евроатлантическите ангажименти.",
    energy: "Подкрепа за енергийна стабилност, инвестиции и сигурност на доставките.",
    migration: "Подкрепа за прагматичен и контролиран подход към миграцията.",
    taxes: "Запазване на предвидима данъчна среда.",
    profile: { taxes: "low", eu: "pro", russia: "neutral", state: "medium" }
  },
  {
    name: "АЛИАНС ЗА ПРАВА И СВОБОДИ",
    short: "АПС",
    type: "coalition",
    logoText: "АП",
    logoClass: "bg-teal-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/percoal",
    officialProgramUrl: null,
    officialWebsite: null,
    infoStatus: "limited",
    economy: "Няма публично достъпна подробна предизборна програма или ясно формулирани позиции по тази тема към момента.",
    healthcare: "Няма достатъчно публична информация за конкретни политики по тази тема.",
    education: "Няма достатъчно публична информация за конкретни политики по тази тема.",
    eu: "Няма достатъчно публична информация за конкретна позиция относно ЕС.",
    russia: "Няма публично достъпна ясна позиция по тази тема.",
    nato: "Няма публично достъпна ясна позиция по тази тема.",
    energy: "Няма публично достъпна ясна позиция по тази тема.",
    migration: "Няма публично достъпна ясна позиция по тази тема.",
    taxes: "Няма публично достъпна ясна позиция по тази тема.",
    profile: { taxes: "medium", eu: "neutral", russia: "neutral", state: "medium" }
  },
  {
    name: "ВЪЗРАЖДАНЕ",
    short: "Възр.",
    type: "party",
    logoText: "В",
    logoClass: "bg-amber-600 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
    officialProgramUrl: null,
    officialWebsite: null,
    infoStatus: "full",
    economy: "По-силна държавна защита на националната икономика и ограничаване на външната зависимост.",
    healthcare: "По-голяма роля на държавата и национален контрол върху системата.",
    education: "По-силен акцент върху национална идентичност и държавно образование.",
    eu: "Силно скептична позиция към по-дълбока интеграция в ЕС.",
    russia: "По-близки отношения и по-мека линия спрямо Русия.",
    nato: "Скептична и по-критична позиция към външни зависимости в сигурността.",
    energy: "Подкрепа за по-силна енергийна самостоятелност и развитие на националните мощности.",
    migration: "Подкрепа за много по-строга миграционна политика и засилен граничен контрол.",
    taxes: "По-скоро запазване на настоящата система с национален приоритет.",
    profile: { taxes: "medium", eu: "skeptic", russia: "close", state: "high" }
  },
  {
    name: "ИМА ТАКЪВ НАРОД",
    short: "ИТН",
    type: "party",
    logoText: "И",
    logoClass: "bg-slate-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
    officialProgramUrl: null,
    officialWebsite: null,
    infoStatus: "full",
    economy: "По-прагматичен подход с акцент върху ефективност и ограничаване на злоупотребите.",
    healthcare: "Реформи за по-добро управление и достъп до услуги.",
    education: "Модернизиране на образованието и по-практична насоченост.",
    eu: "Умерено проевропейска позиция с акцент върху национален интерес.",
    russia: "По-скоро балансиран и прагматичен подход.",
    nato: "Подкрепа за членството в НАТО с акцент върху прагматичен национален интерес.",
    energy: "Подкрепа за енергийна сигурност и практически решения в сектора.",
    migration: "Подкрепа за по-строг контрол и практични мерки по границите.",
    taxes: "Запазване на стабилна данъчна рамка.",
    profile: { taxes: "medium", eu: "pro", russia: "neutral", state: "medium" }
  }
];

const extraParties = [
  "СЪПРОТИВА","НАРОДНА ПАРТИЯ ИСТИНАТА И САМО ИСТИНАТА","ВЕЛИЧИЕ","НАЦИОНАЛНО ДВИЖЕНИЕ НЕПОКОРНА БЪЛГАРИЯ",
  "Партия на ЗЕЛЕНИТЕ","ПРЯКА ДЕМОКРАЦИЯ","БЪЛГАРИЯ МОЖЕ","НАЦИЯ","МОРАЛ ЕДИНСТВО ЧЕСТ","ГЛАС НАРОДЕН",
  "ДВИЖЕНИЕ НА НЕПАРТИЙНИТЕ КАНДИДАТИ","МОЯ БЪЛГАРИЯ","ТРЕТИ МАРТ","СИНЯ БЪЛГАРИЯ","ПРОГРЕСИВНА БЪЛГАРИЯ",
  "СИЯНИЕ","АНТИКОРУПЦИОНЕН БЛОК"
];
const extraColors = ["bg-rose-700 text-white","bg-orange-700 text-white","bg-violet-700 text-white","bg-pink-700 text-white","bg-lime-700 text-white","bg-sky-700 text-white","bg-blue-800 text-white","bg-gray-700 text-white","bg-red-800 text-white","bg-fuchsia-700 text-white","bg-stone-700 text-white","bg-green-700 text-white","bg-orange-600 text-white","bg-blue-600 text-white","bg-purple-700 text-white","bg-yellow-500 text-black","bg-emerald-800 text-white"];
extraParties.forEach((name, i) => {
  parties.push({
    name,
    short: name.slice(0, 10),
    type: i < 11 ? "party" : "coalition",
    logoText: name.split(" ").slice(0, 2).map(x => x[0]).join("").slice(0, 2),
    logoClass: extraColors[i],
    cikUrl: i < 11 ? "https://www.cik.bg/bg/ns19.04.2026/registers/per" : "https://www.cik.bg/bg/ns19.04.2026/registers/percoal",
    officialProgramUrl: null,
    officialWebsite: null,
    infoStatus: "limited",
    economy: "Няма публично достъпна подробна предизборна програма или ясно формулирани позиции по тази тема към момента.",
    healthcare: "Няма достатъчно публична информация за конкретни политики по тази тема.",
    education: "Няма достатъчно публична информация за конкретни политики по тази тема.",
    eu: "Няма публично достъпна ясна позиция по тази тема.",
    russia: "Няма публично достъпна ясна позиция по тази тема.",
    nato: "Няма публично достъпна ясна позиция по тази тема.",
    energy: "Няма публично достъпна ясна позиция по тази тема.",
    migration: "Няма публично достъпна ясна позиция по тази тема.",
    taxes: "Няма публично достъпна ясна позиция по тази тема.",
    profile: { taxes: "medium", eu: "neutral", russia: "neutral", state: "medium" }
  });
});

const topics = [
  { key: "economy", label: "Икономика" },
  { key: "healthcare", label: "Здравеопазване" },
  { key: "education", label: "Образование" },
  { key: "eu", label: "Мнение за ЕС" },
  { key: "russia", label: "Връзки с Русия" },
  { key: "nato", label: "НАТО и сигурност" },
  { key: "energy", label: "Енергетика" },
  { key: "migration", label: "Миграция" },
  { key: "taxes", label: "Данъци" }
];

const questions = [
  { id: 1, text: "Данъците в България трябва да бъдат намалени.", dimension: "taxes", agreementLabel: "намаляване на данъците", getIdealValue: (p) => ({ low: 5, medium: 3, high: 1 }[p.profile.taxes] ?? 3) },
  { id: 2, text: "Осигурителните вноски трябва да бъдат намалени, за да се стимулира бизнесът и заетостта.", dimension: "taxes", agreementLabel: "намаляване на осигуровките", getIdealValue: (p) => ({ low: 5, medium: 3, high: 2 }[p.profile.taxes] ?? 3) },
  { id: 3, text: "Трябва да се въведе прогресивен данък (по-богатите да плащат по-висок процент).", dimension: "taxes", agreementLabel: "прогресивно облагане", getIdealValue: (p) => ({ high: 5, medium: 3, low: 1 }[p.profile.taxes] ?? 3) },
  { id: 5, text: "Държавата трябва да има по-голяма роля в икономиката чрез регулации и държавни предприятия.", dimension: "state", agreementLabel: "силна роля на държавата", getIdealValue: (p) => ({ high: 5, medium: 3, low: 1 }[p.profile.state] ?? 3) },
  { id: 6, text: "Минималната работна заплата трябва да се увеличава по-бързо.", dimension: "state", agreementLabel: "по-висока минимална заплата", getIdealValue: (p) => ({ high: 5, medium: 3, low: 2 }[p.profile.state] ?? 3) },
  { id: 7, text: "Пенсиите трябва да се увеличат значително, дори ако това увеличи разходите на бюджета.", dimension: "state", agreementLabel: "по-високи пенсии", getIdealValue: (p) => ({ high: 5, medium: 3, low: 1 }[p.profile.state] ?? 3) },
  { id: 8, text: "Таванът на максималната пенсия трябва да бъде премахнат.", dimension: "state", agreementLabel: "премахване на тавана на пенсиите", getIdealValue: () => 3 },
  { id: 9, text: "Социалните помощи трябва да се увеличат за хората с ниски доходи.", dimension: "state", agreementLabel: "повече социални помощи", getIdealValue: (p) => ({ high: 5, medium: 3, low: 1 }[p.profile.state] ?? 3) },
  { id: 10, text: "Държавата трябва да дава повече финансови стимули за раждаемост и семейства с деца.", dimension: "state", agreementLabel: "стимули за семейства", getIdealValue: (p) => ({ high: 5, medium: 3, low: 2 }[p.profile.state] ?? 3) },
  { id: 11, text: "Трябва да има по-строги мерки и контрол срещу корупцията в институциите.", dimension: "governance", agreementLabel: "силна антикорупционна политика", getIdealValue: () => 4 },
  { id: 12, text: "Трябва да се намали броят на държавните служители и администрацията.", dimension: "state", agreementLabel: "по-малка администрация", getIdealValue: (p) => ({ low: 5, medium: 3, high: 1 }[p.profile.state] ?? 3) },
  { id: 13, text: "Референдумите трябва да се използват по-често за важни политически решения.", dimension: "governance", agreementLabel: "повече референдуми", getIdealValue: () => 3 },
  { id: 14, text: "Президентът трябва да има повече правомощия.", dimension: "governance", agreementLabel: "по-силен президент", getIdealValue: () => 3 },
  { id: 15, text: "България трябва да бъде силно интегрирана в Европейския съюз.", dimension: "eu", agreementLabel: "силна интеграция в ЕС", getIdealValue: (p) => ({ pro: 5, neutral: 3, skeptic: 1 }[p.profile.eu] ?? 3) },
  { id: 16, text: "България трябва да следва общата политика на ЕС дори когато не е напълно изгодна за страната.", dimension: "eu", agreementLabel: "следване на политиката на ЕС", getIdealValue: (p) => ({ pro: 5, neutral: 3, skeptic: 1 }[p.profile.eu] ?? 3) },
  { id: 17, text: "България трябва да поддържа по-близки политически и икономически отношения с Русия.", dimension: "russia", agreementLabel: "по-близки отношения с Русия", getIdealValue: (p) => ({ close: 5, neutral: 3, far: 1 }[p.profile.russia] ?? 3) },
  { id: 18, text: "Членството в НАТО е важно за сигурността на България.", dimension: "security", agreementLabel: "подкрепа за НАТО", getIdealValue: () => 4 },
  { id: 19, text: "България трябва да инвестира повече в ядрена енергетика.", dimension: "energy", agreementLabel: "ядрена енергетика", getIdealValue: () => 3 },
  { id: 20, text: "Зелените политики (намаляване на въглеродните емисии) трябва да бъдат приоритет.", dimension: "energy", agreementLabel: "зелени политики", getIdealValue: () => 3 },
  { id: 21, text: "Разходите за армия и отбрана трябва да се увеличат.", dimension: "security", agreementLabel: "по-високи разходи за отбрана", getIdealValue: () => 3 },
  { id: 22, text: "Миграционната политика трябва да бъде по-строга.", dimension: "security", agreementLabel: "по-строга миграционна политика", getIdealValue: () => 3 },
  { id: 23, text: "Държавата трябва да инвестира повече в образование и здравеопазване, дори ако това увеличи данъците.", dimension: "state", agreementLabel: "повече публични инвестиции", getIdealValue: (p) => ({ high: 5, medium: 3, low: 1 }[p.profile.state] ?? 3) },
  { id: 24, text: "Частният сектор трябва да има по-голяма роля в здравеопазването.", dimension: "state", agreementLabel: "повече частен сектор в здравеопазването", getIdealValue: (p) => ({ low: 5, medium: 3, high: 1 }[p.profile.state] ?? 3) },
  { id: 25, text: "Държавата трябва да регулира по-строго големите компании и монополите.", dimension: "state", agreementLabel: "по-строга регулация на големите компании", getIdealValue: (p) => ({ high: 5, medium: 3, low: 1 }[p.profile.state] ?? 3) }
];

function PartyPositionMap({ parties, onSelectParty }) {
  const getX = (party) => ({ skeptic: 10, neutral: 50, pro: 90 }[party.profile.eu] ?? 50);
  const getY = (party) => ({ close: 10, neutral: 50, far: 90 }[party.profile.russia] ?? 50);

  return (
    <div className="rounded-2xl border p-4 space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Карта на позициите на партиите</h2>
        <p className="text-sm text-muted-foreground">
          Хоризонтално: по-скептична към ЕС → по-проевропейска. Вертикално: по-близо до Русия → по-дистанцирана от Русия.
        </p>
      </div>

      <div className="relative h-[520px] rounded-2xl border bg-muted/30 overflow-hidden">
        <div className="absolute inset-y-0 left-1/2 w-px bg-border" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        <div className="absolute left-4 top-4 text-xs text-muted-foreground">ЕС-скептични</div>
        <div className="absolute right-4 top-4 text-xs text-muted-foreground">Про-ЕС</div>
        <div className="absolute left-4 bottom-4 text-xs text-muted-foreground">По-близо до Русия</div>
        <div className="absolute right-4 bottom-4 text-xs text-muted-foreground">По-далеч от Русия</div>

        {parties.map((party) => (
          <button
            key={party.name}
            type="button"
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${getX(party)}%`, top: `${100 - getY(party)}%` }}
            title={party.name}
            onClick={() => onSelectParty?.(party)}
          >
            <div className="flex items-center gap-2 rounded-full border bg-white px-2 py-1 shadow-sm">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold ${party.logoClass}`}>
                {party.logoText}
              </div>
              <span className="hidden md:inline text-xs font-medium">{party.short}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CompareTable({ selectedTopic, parties }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border rounded-2xl overflow-hidden">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left p-3">Партия</th>
            <th className="text-left p-3">Позиция</th>
          </tr>
        </thead>
        <tbody>
          {parties.map((p) => (
            <tr key={p.name} className="border-t align-top">
              <td className="p-3 font-medium">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${p.logoClass}`}>
                    {p.logoText}
                  </div>
                  <span>{p.name}</span>
                  {p.infoStatus === "limited" && <Badge variant="outline">Ограничена информация</Badge>}
                </div>
              </td>
              <td className="p-3">{p[selectedTopic]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PartyCards({ search, selectedPartyName, onSelectParty, parties }) {
  const filtered = parties.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filtered.map((party) => (
        <button
          key={party.name}
          type="button"
          onClick={() => onSelectParty?.(party)}
          className="text-left"
        >
          <Card className={`rounded-2xl shadow transition hover:shadow-md ${selectedPartyName === party.name ? "ring-2 ring-blue-600" : ""}`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${party.logoClass}`}>
                  {party.logoText}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle>{party.name}</CardTitle>
                    {party.infoStatus === "limited" && <Badge variant="outline">Ограничена публична информация</Badge>}
                  </div>
                  <div className="text-xs text-slate-500">{party.short}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><strong>Икономика:</strong><p>{party.economy}</p></div>
              <div><strong>Здравеопазване:</strong><p>{party.healthcare}</p></div>
              <div><strong>Образование:</strong><p>{party.education}</p></div>
              <div><strong>Мнение за ЕС:</strong><p>{party.eu}</p></div>
              <div><strong>Връзки с Русия:</strong><p>{party.russia}</p></div>
              <div><strong>НАТО:</strong><p>{party.nato}</p></div>
              <div><strong>Енергетика:</strong><p>{party.energy}</p></div>
              <div><strong>Миграция:</strong><p>{party.migration}</p></div>
              <div><strong>Данъци:</strong><p>{party.taxes}</p></div>
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}

function VotingQuiz({ parties }) {
  const [answers, setAnswers] = useState(
    Object.fromEntries(questions.map((q) => [q.id, 3]))
  );
  const [result, setResult] = useState(null);
  const [selectedInsightParty, setSelectedInsightParty] = useState(null);
  const [shareMessage, setShareMessage] = useState("");

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const getMatchPoints = (answer, ideal) => 4 - Math.abs(answer - ideal);

  const buildPartyInsight = (party) => {
    const details = questions.map((question) => {
      const answer = answers[question.id] ?? 3;
      const ideal = question.getIdealValue(party);
      const distance = Math.abs(answer - ideal);
      const points = getMatchPoints(answer, ideal);

      const partyPosition = ideal >= 4
        ? `позицията на партията е „подкрепя ${question.agreementLabel}“`
        : ideal <= 2
        ? `позицията на партията е „по-скоро е против ${question.agreementLabel}“`
        : `позицията на партията е по-умерена по темата „${question.agreementLabel}“`;

      let explanation = `Имате сериозно разминаване с ${party.name}. По този въпрос ${partyPosition}, а вашият отговор е ${answer}/5.`;
      if (distance <= 1) explanation = `Вашият отговор е много близо до позицията на ${party.name}. По този въпрос ${partyPosition}.`;
      else if (distance === 2) explanation = `${party.name} е частично близо до вашата позиция. По този въпрос ${partyPosition}, докато вашият отговор е ${answer}/5.`;

      return { id: question.id, text: question.text, answer, ideal, distance, points, explanation, isStrongMatch: distance <= 1 };
    });

    const avgDistance = details.reduce((sum, item) => sum + item.distance, 0) / details.length;

    return {
      strongestMatches: details.filter((item) => item.isStrongMatch).sort((a, b) => a.distance - b.distance || b.points - a.points).slice(0, 3),
      biggestDifferences: details.filter((item) => item.distance >= 2).sort((a, b) => b.distance - a.distance || a.points - b.points).slice(0, 3),
      details,
      summary:
        avgDistance <= 1.2
          ? `Програмата на ${party.name} е много близка до вашите възгледи по повечето въпроси.`
          : avgDistance <= 2
          ? `Програмата на ${party.name} съвпада с вашите виждания по част от основните теми, но има и осезаеми различия.`
          : `Програмата на ${party.name} има ограничено съвпадение с вашите виждания и значими разминавания по ключови въпроси.`,
    };
  };

  const calculate = () => {
    const maxScore = questions.length * 4;
    const ranking = parties
      .map((party) => {
        let score = 0;
        let totalDistance = 0;

        questions.forEach((question) => {
          const answer = answers[question.id] ?? 3;
          const ideal = question.getIdealValue(party);
          score += getMatchPoints(answer, ideal);
          totalDistance += Math.abs(answer - ideal);
        });

        return {
          ...party,
          score,
          percent: Math.round((score / maxScore) * 100),
          totalDistance,
          insight: buildPartyInsight(party),
        };
      })
      .sort((a, b) => b.score - a.score || a.totalDistance - b.totalDistance || b.percent - a.percent);

    setResult({ best: ranking[0], ranking });
    setSelectedInsightParty(ranking[0]);
    setShareMessage("");
  };

  const shareResult = async () => {
    if (!result?.best) return;
    const text = `Моят най-близък политически профил е ${result.best.name} (${result.best.percent}% съвпадение) в теста за сравнение на партиите.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Моят резултат от теста за партиите", text, url: window.location.href });
        setShareMessage("Резултатът беше споделен успешно.");
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        setShareMessage("Линкът и резултатът са копирани в clipboard.");
      }
    } catch {
      setShareMessage("Не успяхме да споделим резултата. Опитайте отново.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Тест: За коя партия съвпадат вижданията ви?</h2>
        <p className="text-sm text-slate-500">
          Използвай скалата от 1 до 5 за всяко твърдение. 1 означава „напълно не съм съгласен", 3 е неутрално, а 5 означава „напълно съм съгласен“.
        </p>
      </div>

      {questions.map((q) => {
        const value = answers[q.id] ?? 3;
        return (
          <div key={q.id} className="border rounded-xl p-4 space-y-4 bg-white">
            <div className="font-medium">{q.text}</div>
            <div className="px-2">
              <Slider min={1} max={5} step={1} value={[value]} onValueChange={(vals) => handleAnswer(q.id, vals[0])} />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 gap-3">
              <span>1 · Не съм съгласен</span>
              <span className="text-sm font-semibold text-slate-900">{value}</span>
              <span>5 · Напълно съм съгласен</span>
            </div>
          </div>
        );
      })}

      <div className="flex gap-3 flex-wrap">
        <Button onClick={calculate}>Виж резултат</Button>
        <Button variant="secondary" onClick={shareResult} disabled={!result?.best}>Сподели резултата</Button>
        <Button variant="outline" onClick={() => {
          setAnswers(Object.fromEntries(questions.map((q) => [q.id, 3])));
          setResult(null);
          setSelectedInsightParty(null);
          setShareMessage("");
        }}>Нулирай теста</Button>
      </div>

      {shareMessage && <div className="rounded-xl border bg-slate-50 p-3 text-sm text-slate-500">{shareMessage}</div>}

      <div className="w-full border rounded-2xl p-6 text-center text-sm text-slate-500 bg-white">
        <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-2974245059167035" data-ad-slot="13909587580" data-ad-format="auto" data-full-width-responsive="true"></ins>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-6 border rounded-2xl bg-slate-50">
            <strong>Най-близката партия до вашите виждания:</strong>
            <div className="mt-4 flex items-center gap-3 rounded-xl border bg-white p-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${result.best.logoClass}`}>{result.best.logoText}</div>
              <div>
                <div className="text-2xl font-bold">{result.best.name}</div>
                <div className="text-sm text-slate-500">{result.best.percent}% съвпадение · {result.best.score} точки</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {result.ranking.map((party) => (
              <button key={party.name} type="button" onClick={() => setSelectedInsightParty(party)} className={`border rounded-2xl p-4 flex items-center justify-between gap-4 text-left transition hover:shadow-sm bg-white ${selectedInsightParty?.name === party.name ? "ring-2 ring-blue-600" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${party.logoClass}`}>{party.logoText}</div>
                  <div>
                    <div className="font-semibold">{party.name}</div>
                    <div className="text-xs text-slate-500">{party.score} точки</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{party.percent}%</div>
                  <div className="text-xs text-slate-500">съвпадение</div>
                </div>
              </button>
            ))}
          </div>

          {selectedInsightParty && (
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${selectedInsightParty.logoClass}`}>{selectedInsightParty.logoText}</div>
                  <div>
                    <CardTitle>Защо {selectedInsightParty.name} е на тази позиция</CardTitle>
                    <div className="text-sm text-slate-500">{selectedInsightParty.percent}% съвпадение · {selectedInsightParty.score} точки</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-sm">
                <p className="text-slate-500">{selectedInsightParty.insight.summary}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Къде съвпадате най-много</h3>
                    {selectedInsightParty.insight.strongestMatches.length > 0 ? (
                      selectedInsightParty.insight.strongestMatches.map((item) => (
                        <div key={item.id} className="rounded-xl border p-3 space-y-2 bg-white">
                          <Badge variant="secondary">Силно съвпадение</Badge>
                          <div className="font-medium">{item.text}</div>
                          <div className="text-slate-500">{item.explanation}</div>
                          <div className="text-xs text-slate-500">Ваш отговор: {item.answer}/5 · Профил на партията: {item.ideal}/5 · {item.points} точки</div>
                        </div>
                      ))
                    ) : <div className="rounded-xl border p-3 text-slate-500 bg-white">Няма изразени силни съвпадения по текущите отговори.</div>}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Къде се различавате</h3>
                    {selectedInsightParty.insight.biggestDifferences.length > 0 ? (
                      selectedInsightParty.insight.biggestDifferences.map((item) => (
                        <div key={item.id} className="rounded-xl border p-3 space-y-2 bg-white">
                          <Badge variant="outline">Разминаване</Badge>
                          <div className="font-medium">{item.text}</div>
                          <div className="text-slate-500">{item.explanation}</div>
                          <div className="text-xs text-slate-500">Ваш отговор: {item.answer}/5 · Профил на партията: {item.ideal}/5 · {item.points} точки</div>
                        </div>
                      ))
                    ) : <div className="rounded-xl border p-3 text-slate-500 bg-white">Няма големи разминавания по текущите отговори.</div>}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Подробности по всички въпроси</h3>
                  <div className="space-y-2">
                    {selectedInsightParty.insight.details.map((item) => (
                      <div key={item.id} className="rounded-xl border p-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between bg-white">
                        <div className="space-y-1">
                          <div className="font-medium">{item.text}</div>
                          <div className="text-xs text-slate-500">{item.explanation}</div>
                        </div>
                        <div className="text-xs text-slate-500 md:text-right whitespace-nowrap">
                          Ваш: {item.answer}/5<br />
                          Партия: {item.ideal}/5<br />
                          Точки: {item.points}/4
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function ElectionPlatformComparator() {
  useEffect(() => {
    if (!document.querySelector('script[data-ga="true"]')) {
      const gaScript = document.createElement("script");
      gaScript.async = true;
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-R51QVD3221";
      gaScript.setAttribute("data-ga", "true");
      document.head.appendChild(gaScript);

      const gaConfig = document.createElement("script");
      gaConfig.setAttribute("data-ga", "true");
      gaConfig.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);} 
        gtag('js', new Date());
        gtag('config', 'G-R51QVD3221');
      `;
      document.head.appendChild(gaConfig);
    }

    document.title = "Сравни партиите в България | Тест за коя партия съм";

    const ensureMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    ensureMeta("description", "Тест за коя партия съм, сравнение на предизборни програми и позиции на партиите в България.");
    ensureMeta("keywords", "за коя партия да гласувам, тест за партия, сравнение на партии, избори България");

    if (!document.querySelector('script[data-adsense="true"]')) {
      const adsScript = document.createElement("script");
      adsScript.async = true;
      adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2974245059167035";
      adsScript.crossOrigin = "anonymous";
      adsScript.setAttribute("data-adsense", "true");
      document.head.appendChild(adsScript);
    }
  }, []);

  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("economy");
  const [selectedParty, setSelectedParty] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");

  const sortedParties = useMemo(() => [...parties].sort((a, b) => a.name.localeCompare(b.name, "bg")), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const adNodes = document.querySelectorAll('.adsbygoogle');
        adNodes.forEach((node) => {
          if (!node.getAttribute('data-adsbygoogle-status')) {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
          }
        });
      } catch {}
    }, 250);
    return () => clearTimeout(timer);
  }, [currentPage]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <header className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Сравни предизборните програми</h1>
            <p className="text-slate-500 max-w-2xl">Независим инструмент за сравнение на политическите платформи.</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant={currentPage === "home" ? "default" : "outline"} onClick={() => setCurrentPage("home")}>Тест</Button>
            <Button variant={currentPage === "compare" ? "default" : "outline"} onClick={() => setCurrentPage("compare")}>Сравнение на партии</Button>
            <Button variant={currentPage === "map" ? "default" : "outline"} onClick={() => setCurrentPage("map")}>Карта ЕС и Русия</Button>
          </div>
        </div>

        {(currentPage === "home" || currentPage === "compare") && (
          <div className="flex gap-4 flex-wrap">
            <Input placeholder="Търси партия..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
            {currentPage === "compare" && (
              <Select onValueChange={setTopic} defaultValue="economy">
                <SelectTrigger className="w-56"><SelectValue placeholder="Избери тема" /></SelectTrigger>
                <SelectContent>
                  {topics.map((t) => <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </header>

      {currentPage === "home" ? (
        <>
          <section className="space-y-4"><VotingQuiz parties={sortedParties} /></section>

          <div className="w-full border rounded-2xl p-8 text-center text-sm text-slate-500 bg-white">
            <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-2974245059167035" data-ad-slot="13909587580" data-ad-format="auto" data-full-width-responsive="true"></ins>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Всички партии</h2>
            <PartyCards search={search} selectedPartyName={selectedParty?.name} onSelectParty={setSelectedParty} parties={sortedParties} />

            {selectedParty && (
              <Card className="rounded-2xl border shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${selectedParty.logoClass}`}>{selectedParty.logoText}</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle>{selectedParty.name}</CardTitle>
                        {selectedParty.infoStatus === "limited" && <Badge variant="outline">Ограничена публична информация</Badge>}
                      </div>
                      <div className="text-sm text-slate-500">{selectedParty.type === "coalition" ? "Коалиция" : "Партия"}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-sm">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold">Контакти и източници</h3>
                      <div className="rounded-xl border p-4 space-y-2 bg-white">
                        <div><strong>Официален регистър в ЦИК:</strong>{" "}
                          <a href={selectedParty.cikUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline underline-offset-4">отвори регистрацията</a>
                        </div>
                        <div><strong>Официална програма:</strong>{" "}
                          {selectedParty.officialProgramUrl ? (
                            <a href={selectedParty.officialProgramUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline underline-offset-4">отвори програмата</a>
                          ) : <span className="text-slate-500">няма добавен официален линк към момента</span>}
                        </div>
                        <div><strong>Официален сайт:</strong>{" "}
                          {selectedParty.officialWebsite ? (
                            <a href={selectedParty.officialWebsite} target="_blank" rel="noreferrer" className="text-blue-600 underline underline-offset-4">отвори сайта</a>
                          ) : <span className="text-slate-500">няма добавен официален сайт към момента</span>}
                        </div>
                        <div className="text-slate-500">За част от формациите пълните контакти и официалните линкове още не са въведени ръчно в сайта. До тогава може да се ползва официалният регистър на ЦИК.</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold">Кратък профил</h3>
                      <div className="rounded-xl border p-4 space-y-2 bg-white">
                        <div><strong>Икономика:</strong> {selectedParty.economy}</div>
                        <div><strong>Здравеопазване:</strong> {selectedParty.healthcare}</div>
                        <div><strong>Образование:</strong> {selectedParty.education}</div>
                        <div><strong>ЕС:</strong> {selectedParty.eu}</div>
                        <div><strong>Русия:</strong> {selectedParty.russia}</div>
                        <div><strong>НАТО:</strong> {selectedParty.nato}</div>
                        <div><strong>Енергетика:</strong> {selectedParty.energy}</div>
                        <div><strong>Миграция:</strong> {selectedParty.migration}</div>
                        <div><strong>Данъци:</strong> {selectedParty.taxes}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          <div className="w-full border rounded-2xl p-8 text-center text-sm text-slate-500 bg-white">
            <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client="ca-pub-2974245059167035" data-ad-slot="13909587580" data-ad-format="auto" data-full-width-responsive="true"></ins>
          </div>
        </>
      ) : currentPage === "compare" ? (
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Сравнение на програмите</h2>
            <CompareTable selectedTopic={topic} parties={sortedParties.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))} />
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <PartyPositionMap parties={sortedParties} onSelectParty={setSelectedParty} />
        </section>
      )}

      <footer className="text-center text-xs text-slate-500 pt-10 space-y-2">
        <div>Независим проект за сравнение на предизборни програми.</div>
        <div className="flex justify-center gap-4 flex-wrap">
          <span>About</span>
          <span>Privacy Policy</span>
          <span>Contact</span>
        </div>
      </footer>
    </div>
  );
}
