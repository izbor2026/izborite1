
import { useMemo, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  },
  {
    name: "СЪПРОТИВА",
    short: "СЪПР.",
    type: "party",
    logoText: "С",
    logoClass: "bg-rose-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
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
  },
  {
    name: "НАРОДНА ПАРТИЯ ИСТИНАТА И САМО ИСТИНАТА",
    short: "НПИСИ",
    type: "party",
    logoText: "НИ",
    logoClass: "bg-orange-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
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
  },
  {
    name: "ВЕЛИЧИЕ",
    short: "ВЕЛ.",
    type: "party",
    logoText: "ВЕ",
    logoClass: "bg-violet-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
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
  },
  {
    name: "НАЦИОНАЛНО ДВИЖЕНИЕ НЕПОКОРНА БЪЛГАРИЯ",
    short: "НДНБ",
    type: "party",
    logoText: "НБ",
    logoClass: "bg-pink-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
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
  },
  {
    name: "Партия на ЗЕЛЕНИТЕ",
    short: "ЗЕЛ.",
    type: "party",
    logoText: "З",
    logoClass: "bg-lime-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
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
    profile: { taxes: "medium", eu: "pro", russia: "neutral", state: "medium" }
  },
  {
    name: "ПРЯКА ДЕМОКРАЦИЯ",
    short: "ПД",
    type: "party",
    logoText: "П",
    logoClass: "bg-sky-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
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
  },
  {
    name: "БЪЛГАРИЯ МОЖЕ",
    short: "БМ",
    type: "party",
    logoText: "БМ",
    logoClass: "bg-blue-800 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
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
  },
  {
    name: "НАЦИЯ",
    short: "НАЦ.",
    type: "party",
    logoText: "Н",
    logoClass: "bg-gray-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
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
  },
  {
    name: "МОРАЛ ЕДИНСТВО ЧЕСТ",
    short: "МЕЧ",
    type: "party",
    logoText: "М",
    logoClass: "bg-red-800 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
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
  },
  {
    name: "ГЛАС НАРОДЕН",
    short: "ГН",
    type: "party",
    logoText: "ГН",
    logoClass: "bg-fuchsia-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
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
  },
  {
    name: "ДВИЖЕНИЕ НА НЕПАРТИЙНИТЕ КАНДИДАТИ",
    short: "ДНК",
    type: "party",
    logoText: "ДН",
    logoClass: "bg-stone-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
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
  },
  {
    name: "МОЯ БЪЛГАРИЯ",
    short: "МБ",
    type: "coalition",
    logoText: "МБ",
    logoClass: "bg-green-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/percoal",
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
  },
  {
    name: "ТРЕТИ МАРТ",
    short: "3 МАРТ",
    type: "coalition",
    logoText: "3М",
    logoClass: "bg-orange-600 text-white",
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
    profile: { taxes: "medium", eu: "skeptic", russia: "neutral", state: "medium" }
  },
  {
    name: "СИНЯ БЪЛГАРИЯ",
    short: "СБ",
    type: "coalition",
    logoText: "СБ",
    logoClass: "bg-blue-600 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/percoal",
    officialProgramUrl: null,
    officialWebsite: null,
    infoStatus: "limited",
    economy: "Няма публично достъпна подробна предизборна програма или ясно формулирани позиции по тази тема към момента.",
    healthcare: "Няма достатъчно публична информация за конкретни политики по тази тема.",
    education: "Няма достатъчно публична информация за конкретни политики по тази тема.",
    eu: "Няма достатъчно публична информация за конкретна позиция относно ЕС.",
    russia: "Няма достатъчно публична информация за ясна позиция относно отношенията с Русия.",
    nato: "Няма достатъчно публична информация за конкретна позиция по тази тема.",
    energy: "Няма достатъчно публична информация за конкретни политики по тази тема.",
    migration: "Няма достатъчно публична информация за конкретни политики по тази тема.",
    taxes: "Няма публично достъпна ясна позиция по тази тема.",
    profile: { taxes: "low", eu: "pro", russia: "far", state: "low" }
  },
  {
    name: "ПРОГРЕСИВНА БЪЛГАРИЯ",
    short: "ПБ",
    type: "coalition",
    logoText: "ПБ",
    logoClass: "bg-purple-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/percoal",
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
    profile: { taxes: "medium", eu: "pro", russia: "neutral", state: "high" }
  },
  {
    name: "СИЯНИЕ",
    short: "СИЯ",
    type: "coalition",
    logoText: "СИ",
    logoClass: "bg-yellow-500 text-black",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/percoal",
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
    profile: { taxes: "medium", eu: "pro", russia: "neutral", state: "medium" }
  },
  {
    name: "АНТИКОРУПЦИОНЕН БЛОК",
    short: "АКБ",
    type: "coalition",
    logoText: "АК",
    logoClass: "bg-emerald-800 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/percoal",
    officialProgramUrl: null,
    officialWebsite: null,
    infoStatus: "limited",
    economy: "Няма публично достъпна подробна предизборна програма или ясно формулирани позиции по тази тема към момента.",
    healthcare: "Няма достатъчно публична информация за конкретни политики по тази тема.",
    education: "Няма достатъчно публична информация за конкретни политики по тази тема.",
    eu: "Няма достатъчно публична информация за конкретна позиция относно ЕС.",
    russia: "Няма достатъчно публична информация за ясна позиция относно отношенията с Русия.",
    nato: "Няма достатъчно публична информация за конкретна позиция по тази тема.",
    energy: "Няма достатъчно публична информация за конкретни политики по тази тема.",
    migration: "Няма достатъчно публична информация за конкретни политики по тази тема.",
    taxes: "Няма публично достъпна ясна позиция по тази тема.",
    profile: { taxes: "medium", eu: "pro", russia: "far", state: "medium" }
  }
];

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

function getPartyAnswerForQuestion(party, question) {
  const officialValue = party.officialQuizAnswers?.[question.id];

  if (typeof officialValue === "number") {
    return {
      value: officialValue,
      source: "official",
      sourceLabel: "Официален отговор от партията",
    };
  }

  return {
    value: question.getIdealValue(party),
    source: "ai",
    sourceLabel: "Оценка на база публични данни и AI ресърч",
  };
}

function getPartyMethodLabel(party) {
  return party.officialQuizAnswers
    ? "Има официално попълнен въпросник"
    : "Резултатът е изчислен по публични данни и AI ресърч";
}

function PartyPositionMap({ parties, onSelectParty }) {
  const [mapView, setMapView] = useState("major");
  const [typeFilter, setTypeFilter] = useState("all");

  const getX = (party) => ({ skeptic: 10, neutral: 50, pro: 90 }[party.profile.eu] ?? 50);
  const getY = (party) => ({ close: 10, neutral: 50, far: 90 }[party.profile.russia] ?? 50);

  const majorPartyNames = new Set([
    "ГЕРБ-СДС",
    "БСП – ОБЕДИНЕНА ЛЕВИЦА",
    "ПРОДЪЛЖАВАМЕ ПРОМЯНАТА – ДЕМОКРАТИЧНА БЪЛГАРИЯ",
    "ДВИЖЕНИЕ ЗА ПРАВА И СВОБОДИ",
    "АЛИАНС ЗА ПРАВА И СВОБОДИ",
    "ВЪЗРАЖДАНЕ",
    "ИМА ТАКЪВ НАРОД",
    "СИНЯ БЪЛГАРИЯ",
    "МОРАЛ ЕДИНСТВО ЧЕСТ",
  ]);

  const visibleParties = useMemo(() => {
    return parties.filter((party) => {
      const passesView = mapView === "all" || majorPartyNames.has(party.name);
      const passesType = typeFilter === "all" || party.type === typeFilter;
      return passesView && passesType;
    });
  }, [parties, mapView, typeFilter]);

  const positionedParties = useMemo(() => {
    const groups = new Map();

    visibleParties.forEach((party) => {
      const x = getX(party);
      const y = getY(party);
      const key = `${x}-${y}`;

      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ party, x, y });
    });

    return Array.from(groups.values()).flatMap((group) => {
      if (group.length === 1) {
        return group.map((item) => ({ ...item, offsetX: 0, offsetY: 0, groupSize: 1 }));
      }

      const radius = Math.min(22, 8 + group.length * 2.4);

      return group.map((item, index) => {
        const angle = (Math.PI * 2 * index) / group.length;
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius;

        return {
          ...item,
          offsetX,
          offsetY,
          groupSize: group.length,
        };
      });
    });
  }, [visibleParties]);

  return (
    <div className="rounded-2xl border p-4 space-y-4">
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-semibold">Карта на позициите на партиите</h2>
          <p className="text-sm text-muted-foreground">
            Хоризонтално: по-скептична към ЕС → по-проевропейска. Вертикално: по-близо до Русия → по-дистанцирана от Русия.
          </p>
          <p className="text-xs text-muted-foreground">
            Когато няколко партии са на една и съща позиция, те се раздалечават визуално около общата точка, за да не се застъпват.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Button variant={mapView === "major" ? "default" : "outline"} onClick={() => setMapView("major")}>Само основни</Button>
          <Button variant={mapView === "all" ? "default" : "outline"} onClick={() => setMapView("all")}>Покажи всички</Button>
          <Button variant={typeFilter === "all" ? "default" : "outline"} onClick={() => setTypeFilter("all")}>Всички</Button>
          <Button variant={typeFilter === "party" ? "default" : "outline"} onClick={() => setTypeFilter("party")}>Само партии</Button>
          <Button variant={typeFilter === "coalition" ? "default" : "outline"} onClick={() => setTypeFilter("coalition")}>Само коалиции</Button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">Видими: {visibleParties.length}</Badge>
          <Badge variant="outline">Основни партии = по-четима карта</Badge>
          <Badge variant="outline">Всички = пълна картина</Badge>
        </div>
      </div>

      <div className="relative h-[560px] rounded-2xl border bg-muted/30 overflow-hidden">
        <div className="absolute inset-y-0 left-1/2 w-px bg-border" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        <div className="absolute left-4 top-4 text-xs text-muted-foreground">ЕС-скептични</div>
        <div className="absolute right-4 top-4 text-xs text-muted-foreground">Про-ЕС</div>
        <div className="absolute left-4 bottom-4 text-xs text-muted-foreground">По-близо до Русия</div>
        <div className="absolute right-4 bottom-4 text-xs text-muted-foreground">По-далеч от Русия</div>

        {positionedParties.map(({ party, x, y, offsetX, offsetY, groupSize }) => (
          <button
            key={party.name}
            type="button"
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `calc(${x}% + ${offsetX}px)`,
              top: `calc(${100 - y}% + ${offsetY}px)`,
              zIndex: groupSize > 1 ? 20 : 10,
            }}
            title={groupSize > 1 ? `${party.name} · споделена позиция с още ${groupSize - 1} формации` : party.name}
            onClick={() => onSelectParty?.(party)}
          >
            <div className="flex items-center gap-2 rounded-full border bg-background px-2 py-1 shadow-sm hover:shadow-md transition max-w-[180px]">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${party.logoClass}`}>
                {party.logoText}
              </div>
              <span className="hidden md:inline text-xs font-medium truncate">{party.short}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-xl border p-3 bg-background text-xs text-muted-foreground">
        Съвет: започнете с „Само основни“, а после превключете на „Покажи всички“, ако искате пълната карта.
      </div>
    </div>
  );
}

function CompareTable({ selectedTopic, parties }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border rounded-2xl overflow-hidden">
        <thead className="bg-muted">
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
          <Card className={`rounded-2xl shadow transition hover:shadow-md ${selectedPartyName === party.name ? "ring-2 ring-primary" : ""}`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${party.logoClass}`}>
                  {party.logoText}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle>{party.name}</CardTitle>
                    {party.officialQuizAnswers && <Badge variant="secondary">Официален въпросник</Badge>}
                    {party.infoStatus === "limited" && <Badge variant="outline">Ограничена публична информация</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">{party.short}</div>
                  <div className="text-[11px] text-muted-foreground">{getPartyMethodLabel(party)}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Икономика:</strong>
                <p>{party.economy}</p>
              </div>
              <div>
                <strong>Здравеопазване:</strong>
                <p>{party.healthcare}</p>
              </div>
              <div>
                <strong>Образование:</strong>
                <p>{party.education}</p>
              </div>
              <div>
                <strong>Мнение за ЕС:</strong>
                <p>{party.eu}</p>
              </div>
              <div>
                <strong>Връзки с Русия:</strong>
                <p>{party.russia}</p>
              </div>
              <div>
                <strong>НАТО:</strong>
                <p>{party.nato}</p>
              </div>
              <div>
                <strong>Енергетика:</strong>
                <p>{party.energy}</p>
              </div>
              <div>
                <strong>Миграция:</strong>
                <p>{party.migration}</p>
              </div>
              <div>
                <strong>Данъци:</strong>
                <p>{party.taxes}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 text-xs text-primary underline underline-offset-4">
                <span>Покажи контакти и детайли</span>
                {party.officialProgramUrl && <span>Официална програма</span>}
              </div>
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

  const normalizeAnswer = (value) => (value >= 4 ? 1 : value <= 2 ? -1 : 0);

  const getAnswerLabel = (value) => {
    const normalized = normalizeAnswer(value);
    if (normalized === 1) return "Да";
    if (normalized === -1) return "Не";
    return "Не се интересувам";
  };

  const getMatchPoints = (answer, ideal) => {
    const normalizedAnswer = normalizeAnswer(answer);
    const normalizedIdeal = normalizeAnswer(ideal);

    if (normalizedAnswer === 0 || normalizedIdeal === 0) {
      return 1;
    }

    return normalizedAnswer === normalizedIdeal ? 2 : 0;
  };

  const buildPartyInsight = (party) => {
    const details = questions.map((question) => {
      const answer = answers[question.id] ?? 3;
      const partyAnswerMeta = getPartyAnswerForQuestion(party, question);
      const ideal = partyAnswerMeta.value
      const normalizedAnswer = normalizeAnswer(answer);
      const normalizedIdeal = normalizeAnswer(ideal);
      const distance = normalizedAnswer === normalizedIdeal ? 0 : normalizedAnswer === 0 || normalizedIdeal === 0 ? 1 : 2
      const points = getMatchPoints(answer, ideal);

      return {
        id: question.id,
        text: question.text,
        dimension: question.dimension,
        answer,
        ideal,
        distance,
        points,
        source: partyAnswerMeta.source,
        sourceLabel: partyAnswerMeta.sourceLabel,
        isStrongMatch: distance <= 1,
        explanation: (() => {
          const partyPosition = ideal >= 4
            ? `позицията на партията е „подкрепя ${question.agreementLabel}“`
            : ideal <= 2
            ? `позицията на партията е „по-скоро е против ${question.agreementLabel}“`
            : `позицията на партията е по-умерена по темата „${question.agreementLabel}“`;

          if (distance === 0) {
            return `Вашият отговор съвпада с позицията на ${party.name}. По този въпрос ${partyPosition}.`;
          }

          if (distance === 1) {
            return `${party.name} е частично близо до вашата позиция. По този въпрос ${partyPosition}, докато вашият отговор е „${getAnswerLabel(answer)}“.`;
          }

          return `Имате разминаване с ${party.name}. По този въпрос ${partyPosition}, а вашият отговор е „${getAnswerLabel(answer)}“.`;
        })(),
      };
    });

    const strongestMatches = details
      .filter((item) => item.isStrongMatch)
      .sort((a, b) => a.distance - b.distance || b.points - a.points)
      .slice(0, 3);

    const biggestDifferences = details
      .filter((item) => item.distance >= 2)
      .sort((a, b) => b.distance - a.distance || a.points - b.points)
      .slice(0, 3);

    const avgDistance = details.reduce((sum, item) => sum + item.distance, 0) / details.length;

    return {
      strongestMatches,
      biggestDifferences,
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
    const maxScore = questions.length * 2;

    const ranking = parties
      .map((party) => {
        let score = 0;
        let totalDistance = 0;

        questions.forEach((question) => {
          const answer = answers[question.id] ?? 3;
          const partyAnswerMeta = getPartyAnswerForQuestion(party, question);
      const ideal = partyAnswerMeta.value
          score += getMatchPoints(answer, ideal);
          totalDistance += Math.abs(answer - ideal);
        });

        const percent = Math.round((score / maxScore) * 100);

        return {
          ...party,
          score,
          percent,
          totalDistance,
          insight: buildPartyInsight(party),
          matchMethod: getPartyMethodLabel(party),
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
        await navigator.share({
          title: "Моят резултат от теста за партиите",
          text,
          url: window.location.href,
        });
        setShareMessage("Резултатът беше споделен успешно.");
        return;
      }

      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      setShareMessage("Линкът и резултатът са копирани в clipboard.");
    } catch {
      setShareMessage("Не успяхме да споделим резултата. Опитайте отново.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Тест: За коя партия съвпадат вижданията ви?</h2>
        <p className="text-sm text-muted-foreground">
          Отговорете на всеки въпрос с една от трите опции: „Да“, „Не“ или „Не се интересувам“. По подразбиране е избрано „Не се интересувам“, за да пропуснете въпрос ако темата не е важна за вас.
        </p>
      </div>

      {questions.map((q) => {
        const value = answers[q.id] ?? 3;

        return (
          <div key={q.id} className="border rounded-xl p-4 space-y-4">
            <div className="font-medium">{q.text}</div>
            <div className="px-2">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={value === 5 ? "default" : "outline"}
                  onClick={() => handleAnswer(q.id, 5)}
                >
                  Да
                </Button>
                <Button
                  variant={value === 3 ? "default" : "outline"}
                  onClick={() => handleAnswer(q.id, 3)}
                >
                  Не се интересувам
                </Button>
                <Button
                  variant={value === 1 ? "default" : "outline"}
                  onClick={() => handleAnswer(q.id, 1)}
                >
                  Не
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex gap-3 flex-wrap">
        <Button onClick={calculate}>Виж резултат</Button>
        <Button variant="secondary" onClick={shareResult} disabled={!result?.best}>
          Сподели резултата
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setAnswers(Object.fromEntries(questions.map((q) => [q.id, 3])));
            setResult(null);
            setSelectedInsightParty(null);
            setShareMessage("");
          }}
        >
          Нулирай теста
        </Button>
      </div>

      {shareMessage && (
        <div className="rounded-xl border bg-muted/50 p-3 text-sm text-muted-foreground">
          {shareMessage}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-6 border rounded-2xl bg-muted">
            <strong>Най-близката партия до вашите виждания:</strong>
            <div className="mt-4 flex items-center gap-3 rounded-xl border bg-background p-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${result.best.logoClass}`}>
                {result.best.logoText}
              </div>
              <div>
                <div className="text-2xl font-bold">{result.best.name}</div>
                <div className="text-sm text-muted-foreground">
                  {result.best.percent}% съвпадение · {result.best.score} от {questions.length * 2} точки
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {result.ranking.map((party) => (
              <button
                key={party.name}
                type="button"
                onClick={() => setSelectedInsightParty(party)}
                className={`border rounded-2xl p-4 flex items-center justify-between gap-4 text-left transition hover:shadow-sm ${selectedInsightParty?.name === party.name ? "ring-2 ring-primary" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${party.logoClass}`}>
                    {party.logoText}
                  </div>
                  <div>
                    <div className="font-semibold">{party.name}</div>
                    <div className="text-xs text-muted-foreground">{party.score} от {questions.length * 2} точки</div>
                    <div className="text-[11px] text-muted-foreground">{party.matchMethod}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{party.percent}%</div>
                  <div className="text-xs text-muted-foreground">съвпадение</div>
                </div>
              </button>
            ))}
          </div>

          {selectedInsightParty && (
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${selectedInsightParty.logoClass}`}>
                    {selectedInsightParty.logoText}
                  </div>
                  <div>
                    <CardTitle>Защо {selectedInsightParty.name} е на тази позиция</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {selectedInsightParty.percent}% съвпадение · {selectedInsightParty.score} от {questions.length * 2} точки
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-sm">
                <div className="space-y-2">
                  <Badge variant={selectedInsightParty.officialQuizAnswers ? "secondary" : "outline"}>
                    {selectedInsightParty.matchMethod}
                  </Badge>
                  <p className="text-muted-foreground">{selectedInsightParty.insight.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Къде съвпадате най-много</h3>
                    {selectedInsightParty.insight.strongestMatches.length > 0 ? (
                      selectedInsightParty.insight.strongestMatches.map((item) => (
                        <div key={item.id} className="rounded-xl border p-3 space-y-2">
                          <Badge variant="secondary">Силно съвпадение</Badge>
                          <div className="font-medium">{item.text}</div>
                          <div className="text-muted-foreground">{item.explanation}</div>
                          <div className="text-xs text-muted-foreground">
                            Ваш отговор: {getAnswerLabel(item.answer)} · Отговор на партията: {getAnswerLabel(item.ideal)} · {item.points} от 2 точки
                          </div>
                          <div className="text-[11px] text-muted-foreground">{item.sourceLabel}</div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border p-3 text-muted-foreground">
                        Няма изразени силни съвпадения по текущите отговори.
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Къде се различавате</h3>
                    {selectedInsightParty.insight.biggestDifferences.length > 0 ? (
                      selectedInsightParty.insight.biggestDifferences.map((item) => (
                        <div key={item.id} className="rounded-xl border p-3 space-y-2">
                          <Badge variant="outline">Разминаване</Badge>
                          <div className="font-medium">{item.text}</div>
                          <div className="text-muted-foreground">{item.explanation}</div>
                          <div className="text-xs text-muted-foreground">
                            Ваш отговор: {getAnswerLabel(item.answer)} · Отговор на партията: {getAnswerLabel(item.ideal)} · {item.points} от 2 точки
                          </div>
                          <div className="text-[11px] text-muted-foreground">{item.sourceLabel}</div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border p-3 text-muted-foreground">
                        Няма големи разминавания по текущите отговори.
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Подробности по всички въпроси</h3>
                  <div className="space-y-2">
                    {selectedInsightParty.insight.details.map((item) => (
                      <div key={item.id} className="rounded-xl border p-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-1">
                          <div className="font-medium">{item.text}</div>
                          <div className="text-xs text-muted-foreground">{item.explanation}</div>
                        </div>
                        <div className="text-xs text-muted-foreground md:text-right whitespace-nowrap">
                          Ваш: {getAnswerLabel(item.answer)}<br />
                          Партия/позиция: {getAnswerLabel(item.ideal)}<br />
                          Точки: {item.points}/2
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

const adPackages = [
  {
    key: "basic",
    name: "Basic",
    price: "250 € / седмица",
    description: "Банер 970×90 на най-видимата позиция в началото на сайта.",
  },
  {
    key: "premium",
    name: "Premium",
    price: "350 € / седмица",
    description: "Банер + допълнително споменаване под теста като спонсор на седмицата.",
  },
  {
    key: "exclusive",
    name: "Exclusive",
    price: "500 € / седмица",
    description: "Единствен рекламен партньор за седмицата без други платени банери на сайта.",
  },
    {
    key: "vip",
    name: "VIP",
    price: "по договаряне",
    description: "Различен размер на банера, времетраене или локация",
  },
];

const siteStats = {
  weeklyVisits: "~ 12 000",
  monthlyVisits: "~ 40 000",
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

function NewsSection({ news, isLoading, compact = false }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Последни новини</h2>
        <Badge variant="outline">Supabase CMS</Badge>
      </div>

      {!supabase && (
        <div className="rounded-2xl border p-4 text-sm text-muted-foreground bg-muted/30">
          За да активирате новините, добавете <strong>VITE_SUPABASE_URL</strong> и <strong>VITE_SUPABASE_ANON_KEY</strong>
          във Vercel Environment Variables.
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border p-4 text-sm text-muted-foreground">Зареждане на новини...</div>
      ) : news.length === 0 ? (
        <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
          Все още няма публикувани новини. Добавете първата новина в Supabase таблицата <strong>news</strong>.
        </div>
      ) : (
        <div className="space-y-3">
          {news.map((item) => (
            <Card key={item.id} className="rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-3 flex-wrap text-xs text-muted-foreground">
                  <span>{item.source_name || "Източник"}</span>
                  <span>{item.published_at ? new Date(item.published_at).toLocaleDateString("bg-BG") : ""}</span>
                </div>
                <div className="font-semibold leading-snug">{item.title}</div>
                {item.summary && <p className="text-sm text-muted-foreground">{item.summary}</p>}
                <div className="flex gap-3 flex-wrap text-sm">
                  {item.source_url && (
                    <a href={item.source_url} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">
                      Прочети източника
                    </a>
                  )}
                  {item.party_name && <Badge variant="secondary">{item.party_name}</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!compact && (
        <div className="rounded-2xl border p-4 bg-muted/30 text-sm text-muted-foreground space-y-2">
          <p><strong>Как да добавяте новини без GitHub:</strong></p>
          <p>1. Отворете Supabase Dashboard → Table Editor → news</p>
          <p>2. Добавете ред с title, summary, source_name, source_url, published_at и is_published=true</p>
          <p>3. Новината ще се появи автоматично в сайта след refresh</p>
        </div>
      )}
    </div>
  );
}

export default function ElectionPlatformComparator() {
  useEffect(() => {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-R51QVD3221";
    document.head.appendChild(gaScript);

    const gaConfig = document.createElement("script");
    gaConfig.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);} 
      gtag('js', new Date());
      gtag('config', 'G-R51QVD3221');
    `;
    document.head.appendChild(gaConfig);

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
    ensureMeta("keywords", "за коя партия да гласувам тест, тест за коя партия съм, сравнение на партии България, избори България партии позиции");

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
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);

  const sortedParties = useMemo(
    () => [...parties].sort((a, b) => a.name.localeCompare(b.name, "bg")),
    []
  );

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

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      if (!supabase) return;
      setNewsLoading(true);

      const { data, error } = await supabase
        .from("news")
        .select("id,title,summary,source_name,source_url,published_at,party_name,is_published")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(8);

      if (!isMounted) return;

      if (!error && data) {
        setNews(data);
      }

      setNewsLoading(false);
    };

    loadNews();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <header className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Сравни предизборните програми</h1>
            <p className="text-muted-foreground max-w-2xl">
              Независим инструмент за сравнение на политическите платформи.
            </p>
            <div className="text-sm text-muted-foreground max-w-3xl space-y-3">
              <p>
                <strong>Тест: За коя партия да гласувам?</strong> Отговорете на въпросите по‑долу и вижте коя
                политическа програма е най‑близо до вашите виждания.
              </p>
              <p>
                Сайтът сравнява позициите на партиите по ключови теми като икономика, данъци, социална политика,
                ЕС, Русия, сигурност, енергетика и миграция. Данните са базирани на публично достъпна информация,
                а когато дадена партия е изпратила официални отговори по въпросника, те се отбелязват изрично.
              </p>
              <p>
                Целта на проекта е да помогне на избирателите да направят по‑информиран избор чрез ясно,
                структурирано и неутрално сравнение на политическите програми.
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant={currentPage === "home" ? "default" : "outline"} onClick={() => setCurrentPage("home")}>Тест</Button>
            <Button variant={currentPage === "compare" ? "default" : "outline"} onClick={() => setCurrentPage("compare")}>Сравнение на партии</Button>
            <Button variant={currentPage === "map" ? "default" : "outline"} onClick={() => setCurrentPage("map")}>Карта ЕС и Русия</Button>
            <Button variant={currentPage === "about" ? "default" : "outline"} onClick={() => setCurrentPage("about")}>About</Button>
            <Button variant={currentPage === "privacy" ? "default" : "outline"} onClick={() => setCurrentPage("privacy")}>Privacy</Button>
            <Button variant={currentPage === "contact" ? "default" : "outline"} onClick={() => setCurrentPage("contact")}>Contact</Button>
            <Button variant={currentPage === "advertise" ? "default" : "outline"} onClick={() => setCurrentPage("advertise")}>Реклама</Button>
            <Button variant={currentPage === "methodology" ? "default" : "outline"} onClick={() => setCurrentPage("methodology")}>Методология</Button>
            <Button variant={currentPage === "terms" ? "default" : "outline"} onClick={() => setCurrentPage("terms")}>Terms</Button>
            <Button variant={currentPage === "news" ? "default" : "outline"} onClick={() => setCurrentPage("news")}>Новини</Button>
          </div>
        </div>

        {currentPage === "compare" && (
          <div className="flex gap-4 flex-wrap">
            <Input
              placeholder="Търси партия..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />

            <Select onValueChange={setTopic} defaultValue="economy">
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Избери тема" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((t) => (
                  <SelectItem key={t.key} value={t.key}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </header>

      {/* Top Banner – advertising space for rent */}
      <div className="w-full border rounded-2xl p-8 text-center bg-amber-50 space-y-4">
        <div className="text-lg font-semibold">Рекламно пространство</div>
        <div className="text-sm text-muted-foreground">
          Банер позиция на началната страница – вижда се от всички посетители преди теста.
        </div>

      

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {adPackages.map((pkg) => (
            <div key={pkg.key} className="border rounded-xl p-4 bg-white">
              <div className="font-semibold">{pkg.name}</div>
              <div className="text-2xl font-bold mt-1">{pkg.price}</div>
              <div className="text-muted-foreground mt-1">{pkg.description}</div>
            </div>
          ))}
        </div>

        <div className="text-sm">
          Запитвания: <span className="font-semibold">contact@izborite.info</span>
        </div>
      </div>

      {currentPage === "home" ? (
        <>
          <section className="grid xl:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
            <div className="space-y-6">
              <VotingQuiz parties={sortedParties} />

              <div className="rounded-2xl border p-5 bg-muted/30 text-sm text-muted-foreground space-y-3 max-w-3xl">
                <h3 className="font-semibold text-foreground">Как работи тестът</h3>
                <p>
                  Тестът сравнява вашите отговори с позициите на политическите партии по ключови
                  теми като икономика, данъци, социална политика, Европейски съюз, Русия,
                  сигурност, енергетика и миграция.
                </p>
                <p>
                  Резултатът показва коя политическа програма е най-близка до вашите възгледи.
                  Съвпадението се изчислява на база десет въпроса и публично достъпна
                  информация за позициите на партиите.
                </p>
                <p>
                  Когато дадена партия е предоставила официални отговори по въпросника,
                  те се използват директно в изчислението.
                </p>
              </div>
            </div>

            <aside className="space-y-4">
              <NewsSection news={news.slice(0, 5)} isLoading={newsLoading} compact />
            </aside>
          </section>
        </>
      ) : currentPage === "news" ? (
        <section className="space-y-6 max-w-4xl">
          <NewsSection news={news} isLoading={newsLoading} />
        </section>
      ) : currentPage === "compare" ? (
        <section className="space-y-6">
          <div className="flex gap-4 flex-wrap">
            <Input
              placeholder="Търси партия..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />

            <Select onValueChange={setTopic} defaultValue="economy">
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Избери тема" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((t) => (
                  <SelectItem key={t.key} value={t.key}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Сравнение на програмите</h2>
            <CompareTable selectedTopic={topic} parties={sortedParties.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))} />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Информация за партиите</h2>
            <PartyCards
              search={search}
              selectedPartyName={selectedParty?.name}
              onSelectParty={setSelectedParty}
              parties={sortedParties.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))}
            />

            {selectedParty && (
              <Card className="rounded-2xl border shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${selectedParty.logoClass}`}>
                      {selectedParty.logoText}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle>{selectedParty.name}</CardTitle>
                        {selectedParty.infoStatus === "limited" && <Badge variant="outline">Ограничена публична информация</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedParty.type === "coalition" ? "Коалиция" : "Партия"}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-sm">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold">Контакти и източници</h3>
                      <div className="rounded-xl border p-4 space-y-2">
              {selectedParty.officialQuizAnswers && <Badge variant="secondary">Използвани са официални отговори на партията за теста</Badge>}
              {!selectedParty.officialQuizAnswers && <Badge variant="outline">Позициите за теста са изведени от публични данни и AI ресърч</Badge>}
                        <div>
                          <strong>Официален регистър в ЦИК:</strong>{" "}
                          <a href={selectedParty.cikUrl} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">
                            отвори регистрацията
                          </a>
                        </div>
                        <div>
                          <strong>Официална програма:</strong>{" "}
                          {selectedParty.officialProgramUrl ? (
                            <a href={selectedParty.officialProgramUrl} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">
                              отвори програмата
                            </a>
                          ) : (
                            <span className="text-muted-foreground">няма добавен официален линк към момента</span>
                          )}
                        </div>
                        <div>
                          <strong>Официален сайт:</strong>{" "}
                          {selectedParty.officialWebsite ? (
                            <a href={selectedParty.officialWebsite} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">
                              отвори сайта
                            </a>
                          ) : (
                            <span className="text-muted-foreground">няма добавен официален сайт към момента</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold">Кратък профил</h3>
                      <div className="rounded-xl border p-4 space-y-2">
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
          </div>
        </section>
      ) : currentPage === "map" ? (
        <section className="space-y-4">
          <PartyPositionMap parties={sortedParties} onSelectParty={setSelectedParty} />
        </section>
      ) : currentPage === "about" ? (
        <section className="space-y-4 max-w-3xl">
          <h2 className="text-2xl font-semibold">About</h2>
          <p>Този сайт е независим инструмент за сравнение на предизборните програми на партиите в България.</p>
          <p>Целта е да помогне на избирателите да сравнят позиции по ключови теми като икономика, ЕС, Русия и данъци.</p>
        </section>
      ) : currentPage === "privacy" ? (
        <section className="space-y-4 max-w-3xl">
          <h2 className="text-2xl font-semibold">Privacy Policy</h2>
          <p>Сайтът използва Google Analytics за статистика и Google AdSense за реклами.</p>
          <p>Не събираме лични данни като име или имейл.</p>
        </section>
      ) : currentPage === "methodology" ? (
        <section className="space-y-4 max-w-4xl">
          <h2 className="text-2xl font-semibold">Методология</h2>
          <p className="text-muted-foreground">
            Тестът сравнява вашите отговори с позициите на партиите по десет ключови въпроса. За всеки въпрос
            могат да се използват два източника: официален отговор от партията или оценка на база публични данни
            и AI ресърч, когато официален отговор не е предоставен.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Източници на позициите</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Официални сайтове и програми на партиите</p>
                <p>• Публични изявления и програмни документи</p>
                <p>• Регистър на ЦИК</p>
                <p>• Официално попълнен въпросник от партия, когато е наличен</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Как се изчислява резултатът</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Да / Да и Не / Не носят пълно съвпадение</p>
                <p>• „Не се интересувам“ дава частично съвпадение</p>
                <p>• Противоположните отговори водят до разминаване</p>
                <p>• Крайният процент показва близостта между вашите виждания и профила на партията</p>
              </CardContent>
            </Card>
          </div>
          <div className="rounded-2xl border p-5 bg-muted/30 text-sm text-muted-foreground space-y-2">
            <p>
              Сайтът не подкрепя и не представлява политическа партия. Целта му е да представя сравнение в
              максимално неутрална и прозрачна форма.
            </p>
            <p>
              Ако партия желае да изпрати официални отговори по въпросника, може да го направи на:
              <span className="font-semibold text-foreground"> contact@izborite.info</span>
            </p>
          </div>
        </section>
      ) : currentPage === "terms" ? (
        <section className="space-y-4 max-w-3xl">
          <h2 className="text-2xl font-semibold">Terms of Service</h2>
          <p className="text-muted-foreground">
            Този сайт предоставя информационен инструмент за сравнение на политически
            позиции и предизборни програми на партиите в България.
          </p>
          <p className="text-muted-foreground">
            Информацията е събрана от публични източници като официални сайтове,
            програмни документи, публични изявления и регистри на институции.
          </p>
          <p className="text-muted-foreground">
            Сайтът не представлява и не подкрепя политическа партия или
            кандидат. Целта му е да подпомогне избирателите да направят
            по-информиран избор.
          </p>
        </section>
      ) : currentPage === "contact" ? (
        <section className="space-y-4 max-w-3xl">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p>За предложения, корекции и официални отговори от партии:</p>
          <p className="font-semibold">contact@izborite.info</p>
        </section>
      ) : (
        <section className="space-y-6 max-w-4xl">
          <h2 className="text-2xl font-semibold">Реклама в сайта</h2>
          <p className="text-muted-foreground">
            Сайтът е насочен към хора, които активно търсят информация за изборите, сравняват партии и попълват теста.
            Това прави рекламната позиция подходяща за политически, обществени и информационни кампании.
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            {adPackages.map((pkg) => (
              <Card key={pkg.key} className="rounded-2xl">
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">{pkg.price}</div>
                  <p className="text-muted-foreground">{pkg.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="rounded-2xl border p-5 bg-muted/30 space-y-2">
            <div><strong>Ориентировъчен трафик:</strong> {siteStats.weeklyVisits} посещения седмично</div>
            <div><strong>Формат:</strong> 970×90 или сходен leaderboard банер</div>
            <div><strong>Позиция:</strong> най-горе на сайта, преди теста</div>
            <div><strong>Контакт:</strong> contact@izborite.info</div>
          </div>
        </section>
      )}

      <footer className="text-center text-xs text-muted-foreground pt-10 space-y-2">
        <div>Независим проект за сравнение на предизборни програми.</div>
        <div className="flex justify-center gap-4 flex-wrap">
          <button onClick={() => setCurrentPage("about")} className="underline">About</button>
          <button onClick={() => setCurrentPage("privacy")} className="underline">Privacy Policy</button>
          <button onClick={() => setCurrentPage("contact")} className="underline">Contact</button>
          <button onClick={() => setCurrentPage("advertise")} className="underline">Реклама</button>
          <button onClick={() => setCurrentPage("methodology")} className="underline">Методология</button>
          <button onClick={() => setCurrentPage("terms")} className="underline">Terms</button>
          <button onClick={() => setCurrentPage("news")} className="underline">Новини</button>
        </div>
      </footer>
    </div>
  );
}
