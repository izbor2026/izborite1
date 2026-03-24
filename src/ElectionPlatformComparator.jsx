import { useMemo, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const RAW_PARTIES = [
  {
    name: "ГЕРБ-СДС",
    short: "ГЕРБ-СДС",
    type: "coalition",
    logoText: "ГС",
    logoClass: "bg-emerald-600 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/percoal",
    officialProgramUrl: null,
    officialWebsite: "https://gerb.bg/",
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
    officialWebsite: "https://bsp.bg/",
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
    officialWebsite: "https://ppdb.bg/",
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
    name: "СИНЯ БЪЛГАРИЯ",
    short: "СБ",
    type: "coalition",
    logoText: "СБ",
    logoClass: "bg-blue-600 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/percoal",
    officialProgramUrl: null,
    officialWebsite: "https://sinyabulgaria.bg/",
    infoStatus: "full",
    economy: "Дясноцентристки профил с подкрепа за предприемачеството, предвидима данъчна среда и по-ограничена роля на държавата в икономиката.",
    healthcare: "По-скоро реформаторски подход с акцент върху ефективност, управление и ограничаване на административните дефицити.",
    education: "Подкрепа за по-високи стандарти, гражданско образование и по-силна връзка между образование и реализация.",
    eu: "Ясно проевропейска коалиция с дясноцентристка и антикомунистическа идентичност.",
    russia: "По-дистанцирана линия спрямо Русия и по-ясна ориентация към евроатлантическото пространство.",
    nato: "Подкрепа за евроатлантическата рамка и за по-предвидима политика по сигурността.",
    energy: "Акцент върху енергийна сигурност, диверсификация и по-пазарен подход в сектора.",
    migration: "По-строг контрол и акцент върху държавния капацитет и външната граница.",
    taxes: "По-скоро подкрепа за ниски и предвидими данъци.",
    profile: { taxes: "low", eu: "pro", russia: "far", state: "low" }
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
    infoStatus: "full",
    economy: "Националистически и популистки профил с критика към модела на управление и силен антисистемен тон.",
    healthcare: "По-скоро държавно ориентиран и критичен към сегашния модел подход, без ясно разработена публична програма по сектора.",
    education: "Акцент върху национална идентичност и критика към елитния политически модел.",
    eu: "По-скоро евроскептичен и национално ориентиран профил.",
    russia: "По-мек и по-балансиран тон спрямо Русия в сравнение с твърдо антируски формации.",
    nato: "Скептичен към външни зависимости и близък до национално-суверенистки прочит на сигурността.",
    energy: "Подкрепа за по-силна национална самостоятелност и критика към външни зависимости.",
    migration: "Твърд подход по миграцията и по-силен акцент върху контрол и сигурност.",
    taxes: "Няма ясно разработена данъчна програма, но профилът е по-скоро национално-популистки, отколкото фискално идеологически.",
    profile: { taxes: "medium", eu: "skeptic", russia: "close", state: "high" }
  },
  {
    name: "НАЦИОНАЛНО ДВИЖЕНИЕ НЕПОКОРНА БЪЛГАРИЯ",
    short: "НДНБ",
    type: "party",
    logoText: "НБ",
    logoClass: "bg-pink-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
    officialProgramUrl: null,
    officialWebsite: "https://ndnb.bg/",
    infoStatus: "full",
    economy: "Център-ляв профил с по-силна роля на държавата и акцент върху социални и защитни политики.",
    healthcare: "По-голям публичен ангажимент и по-социално ориентиран подход към системата.",
    education: "Подкрепа за по-силна роля на държавата и за защита на публичния характер на сектора.",
    eu: "По-умерен и предпазлив тон към ЕС, без излизане от европейската рамка.",
    russia: "По-балансиран и по-малко конфронтационен тон по темата Русия.",
    nato: "По-умерен подход към темите за сигурността, с акцент върху националния интерес.",
    energy: "Подкрепа за по-голяма държавна роля и защита на националния интерес в енергетиката.",
    migration: "По-скоро контролирана миграционна политика с акцент върху държавния капацитет.",
    taxes: "По-скоро умерен към по-социален модел, без ясно заявен радикален нискоданъчен курс.",
    profile: { taxes: "medium", eu: "neutral", russia: "neutral", state: "high" }
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
    name: "ГЛАС НАРОДЕН",
    short: "ГН",
    type: "party",
    logoText: "ГН",
    logoClass: "bg-fuchsia-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/per",
    officialProgramUrl: null,
    officialWebsite: "https://glasnaroden.bg/",
    infoStatus: "full",
    economy: "По-скоро протестен и антисистемен профил с еклектичен политически образ, отколкото силно идеологизирана икономическа линия.",
    healthcare: "Няма широко достъпна детайлна секторна програма, но профилът е критичен към традиционния политически модел.",
    education: "Няма детайлна публична програмна рамка, но формацията традиционно разчита на по-нестандартен и граждански образ.",
    eu: "Не се позиционира сред ясно изразените евроскептични или твърдо интеграционистки играчи.",
    russia: "Няма устойчива силно видима публична линия по темата Русия в последния изборен цикъл.",
    nato: "Няма ясно структурирана дълбока програма по сигурността в наличните публични източници.",
    energy: "Ограничена публична конкретика по темата.",
    migration: "Ограничена публична конкретика по темата.",
    taxes: "Няма ясно разработена публична данъчна програма.",
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
    name: "ПРОГРЕСИВНА БЪЛГАРИЯ",
    short: "ПБ",
    type: "coalition",
    logoText: "ПБ",
    logoClass: "bg-purple-700 text-white",
    cikUrl: "https://www.cik.bg/bg/ns19.04.2026/registers/percoal",
    officialProgramUrl: null,
    officialWebsite: "https://progresivnabulgaria.com/",
    infoStatus: "full",
    economy: "Център-ляв профил със социалдемократичен акцент, по-голяма роля на държавата и критика към олигархичния модел.",
    healthcare: "Подкрепа за по-силен публичен ангажимент и по-социален подход към системата.",
    education: "По-силен акцент върху достъпа, публичната роля на държавата и социалната чувствителност в политиките.",
    eu: "Коалицията не поставя под въпрос членството в ЕС и НАТО, но се позиционира по-предпазливо към част от интеграционните решения.",
    russia: "Към нея често се приписва по-мек и по-балансиран тон по темата Русия в сравнение с твърдо антируски формации.",
    nato: "Не отхвърля евроатлантическата рамка, но поставя силен акцент върху националния интерес.",
    energy: "По-голяма роля на държавата и по-критичен поглед към решения, възприемани като външно наложени.",
    migration: "По-умерен и държавно ориентиран подход, без ясно оформен твърд либерален профил.",
    taxes: "По-скоро умерен към по-социален модел, отколкото нискоданъчен дясноцентристки подход.",
    profile: { taxes: "medium", eu: "neutral", russia: "close", state: "high" }
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

const PARTY_OVERRIDES = {
  "ПРОГРЕСИВНА БЪЛГАРИЯ": {
    priority: 1,
    officialWebsite: "https://progresivnabulgaria.com/",
    officialProgramUrl: "https://progresivnabulgaria.com/programa",
    infoStatus: "full",
    profile: { taxes: "medium", eu: "pro", russia: "neutral", state: "high", nato: "neutral", migration: "moderate", energy: "pro", governance: "high" },
    eu: "Подкрепя членството в ЕС и активна роля на България в европейските институции, но с по-силен акцент върху националния интерес и държавния капацитет.",
    russia: "По-балансиран и по-малко конфронтационен тон по темата Русия в сравнение с твърдо антируски формации.",
    nato: "Не отхвърля евроатлантическата рамка, но поставя по-силен акцент върху националния интерес и самостоятелната държавна позиция.",
    energy: "Подкрепя евтина и надеждна енергия за домакинствата и бизнеса, както и по-голяма роля на държавата в стратегическите решения.",
    migration: "По-умерен и държавно ориентиран подход към сигурността и миграцията.",
    taxes: "По-скоро умерен към по-социален модел, отколкото нискоданъчен дясноцентристки подход."
  },
  "ГЕРБ-СДС": {
    priority: 2,
    officialProgramUrl: "https://gerb.bg/",
    profile: { taxes: "low", eu: "pro", russia: "far", state: "medium", nato: "pro", migration: "strict", energy: "pro", governance: "medium" }
  },
  "ПРОДЪЛЖАВАМЕ ПРОМЯНАТА – ДЕМОКРАТИЧНА БЪЛГАРИЯ": {
    priority: 3,
    officialProgramUrl: "https://ppdb.bg/programa-detajl/",
    profile: { taxes: "medium", eu: "pro", russia: "far", state: "medium", nato: "pro", migration: "moderate", energy: "pro", governance: "high" }
  },
  "ВЪЗРАЖДАНЕ": {
    priority: 4,
    officialWebsite: "https://vazrazhdane.bg/",
    officialProgramUrl: "https://vazrazhdane.bg/%D1%86%D0%B5%D0%BB%D0%B8-%D0%B8-%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%B0/",
    profile: { taxes: "medium", eu: "skeptic", russia: "close", state: "high", nato: "skeptic", migration: "strict", energy: "pro", governance: "medium" }
  },
  "ДВИЖЕНИЕ ЗА ПРАВА И СВОБОДИ": {
    priority: 5,
    officialWebsite: "https://www.dps.bg/",
    officialProgramUrl: "https://www.dps.bg/izbori-2026/izborna-programa-2026.html",
    profile: { taxes: "low", eu: "pro", russia: "neutral", state: "medium", nato: "pro", migration: "moderate", energy: "pro", governance: "medium" }
  },
  "БСП – ОБЕДИНЕНА ЛЕВИЦА": {
    priority: 6,
    officialProgramUrl: "https://bsp.bg/news/view/26563-bsp__obedinena_levitsa_s_programa_za_razvitie_ot_0_tochki_i_yasna_zayavka__vreme_e_za_resheniya_.html",
    profile: { taxes: "high", eu: "neutral", russia: "neutral", state: "high", nato: "neutral", migration: "moderate", energy: "pro", governance: "medium" }
  },
  "ИМА ТАКЪВ НАРОД": {
    priority: 7,
    officialWebsite: "https://itn.bg/",
    profile: { taxes: "medium", eu: "pro", russia: "neutral", state: "medium", nato: "pro", migration: "strict", energy: "pro", governance: "medium" }
  },
  "ВЕЛИЧИЕ": {
    priority: 8,
    profile: { taxes: "medium", eu: "skeptic", russia: "close", state: "high", nato: "skeptic", migration: "strict", energy: "pro", governance: "medium" }
  },
  "МОРАЛ ЕДИНСТВО ЧЕСТ": {
    priority: 9,
    officialWebsite: "https://mech.bg/",
    infoStatus: "full",
    economy: "Антисистемен и силно критичен към статуквото профил, с по-скоро държавно и популистки ориентирани решения, отколкото класически десен икономически модел.",
    healthcare: "Поставя акцент върху критика към управлението на системата и по-строг контрол върху публичните разходи.",
    education: "Подчертава нуждата от дисциплина, по-ясни стандарти и по-силен политически контрол върху публичните системи.",
    eu: "По-скоро критичен и антисистемен тон към статуквото в ЕС, без ясно изразена линия за излизане от европейската рамка.",
    russia: "По-скоро балансиран и прагматичен тон по темата Русия.",
    nato: "По-умерен и скептичен към безусловна външнополитическа зависимост профил.",
    energy: "Подкрепя по-силен национален контрол и самостоятелност в стратегическите сектори.",
    migration: "Склонност към по-строга линия по сигурността и миграцията.",
    taxes: "Няма ясно разгърната класическа данъчна програма, но профилът не е насочен към либертариански нискоданъчен модел.",
    profile: { taxes: "medium", eu: "neutral", russia: "neutral", state: "high", nato: "neutral", migration: "strict", energy: "pro", governance: "medium" }
  },
  "СИНЯ БЪЛГАРИЯ": {
    priority: 10,
    officialProgramUrl: "https://sinyabulgaria.bg/programa/",
    profile: { taxes: "low", eu: "pro", russia: "far", state: "low", nato: "pro", migration: "strict", energy: "pro", governance: "high" }
  },
  "НАЦИОНАЛНО ДВИЖЕНИЕ НЕПОКОРНА БЪЛГАРИЯ": {
    priority: 11,
    profile: { taxes: "medium", eu: "neutral", russia: "neutral", state: "high", nato: "neutral", migration: "moderate", energy: "pro", governance: "medium" }
  },
  "АЛИАНС ЗА ПРАВА И СВОБОДИ": {
    priority: 12,
    profile: { taxes: "medium", eu: "neutral", russia: "neutral", state: "medium", nato: "neutral", migration: "moderate", energy: "neutral", governance: "medium" }
  },
  "Партия на ЗЕЛЕНИТЕ": {
    priority: 13,
    infoStatus: "full",
    economy: "Зелен и по-социално чувствителен профил с акцент върху устойчиво развитие, екологични стандарти и по-внимателно отношение към природните ресурси.",
    healthcare: "По-скоро подкрепя публични политики, насочени към качество на средата и превенция.",
    education: "Подкрепя гражданско образование, екологична култура и устойчиви обществени политики.",
    eu: "Проевропейска ориентация, характерна за зелените и екологични партии в Европа.",
    russia: "Няма ясно изразен самостоятелен силен публичен профил по темата Русия, но не стои в евроскептичния лагер.",
    nato: "По-скоро умерена и проевропейска, без силно изразен антинатовски профил.",
    energy: "Предпочитание към устойчиви и екологично съобразени решения, по-предпазливо към силна зависимост от тежки енергийни модели.",
    migration: "По-умерен и хуманен профил в рамките на европейския подход.",
    taxes: "По-скоро умерен модел с готовност за публични инвестиции в устойчиви политики.",
    profile: { taxes: "medium", eu: "pro", russia: "neutral", state: "medium", nato: "pro", migration: "open", energy: "low", governance: "high" }
  },
  "ПРЯКА ДЕМОКРАЦИЯ": {
    priority: 14,
    infoStatus: "full",
    economy: "Профил, в който централна тема е прякото участие на гражданите, а не толкова класическо ляво-дясно икономическо позициониране.",
    healthcare: "По-скоро поддържа идеята за повече граждански контрол и отчетност в публичните системи.",
    education: "Акцент върху гражданско участие и механизми за по-пряка политическа легитимност.",
    eu: "По-скоро неутрален към умерен профил, без ярко изразен евроскептицизъм в последните публични участия.",
    russia: "Няма устойчив силен публичен профил по темата Русия.",
    nato: "По-скоро умерен профил без силно ярка идентичност по темата.",
    energy: "Ограничена програмна конкретика по енергетика.",
    migration: "Ограничена конкретика, по-скоро умерен профил.",
    taxes: "Няма ясно изразена радикална данъчна позиция в наличната публична информация.",
    profile: { taxes: "medium", eu: "neutral", russia: "neutral", state: "medium", nato: "neutral", migration: "moderate", energy: "neutral", governance: "high" }
  },
  "ТРЕТИ МАРТ": {
    priority: 15,
    infoStatus: "full",
    economy: "Национално ориентиран и суверенистки профил с акцент върху държавния интерес и по-критичен поглед към външната зависимост.",
    healthcare: "По-скоро държавно и социално чувствително позициониране, без ярко развита секторна програма.",
    education: "Подчертан акцент върху националната идентичност и историческата символика.",
    eu: "По-скоро евроскептичен към по-предпазлив профил, свързан със суверенистки теми.",
    russia: "По-мек и по-балансиран тон към Русия в сравнение с твърдо антируски формации.",
    nato: "По-предпазлив и по-суверенистки профил по темата сигурност.",
    energy: "Подкрепа за национален контрол и енергийна самостоятелност.",
    migration: "По-строг подход към сигурността и границите.",
    taxes: "Няма силно изразен радикален данъчен профил; по-важен е суверенисткият и държавен акцент.",
    profile: { taxes: "medium", eu: "skeptic", russia: "close", state: "medium", nato: "skeptic", migration: "strict", energy: "pro", governance: "medium" }
  },
  "АНТИКОРУПЦИОНЕН БЛОК": {
    priority: 16,
    infoStatus: "full",
    economy: "Реформаторски профил с акцент върху честни правила, ограничаване на злоупотребите и по-прозрачна бизнес среда.",
    healthcare: "По-скоро фокус върху управление, отчетност и намаляване на системните злоупотреби.",
    education: "Подкрепя институционална реформа, прозрачност и обществена отчетност.",
    eu: "По-скоро проевропейска ориентация, характерна за антикорупционни и реформаторски формати.",
    russia: "По-дистанциран тон спрямо Русия в рамките на проевропейски профил.",
    nato: "Подкрепа за предвидима евроатлантическа рамка.",
    energy: "По-скоро акцент върху прозрачност и контрол, отколкото върху идеологически крайности в сектора.",
    migration: "Умерен към прагматичен подход.",
    taxes: "По-скоро умерен данъчен профил с фокус върху събираемост, прозрачност и контрол.",
    profile: { taxes: "medium", eu: "pro", russia: "far", state: "medium", nato: "pro", migration: "moderate", energy: "neutral", governance: "high" }
  }
};

const parties = RAW_PARTIES.map((party) => ({
  ...party,
  ...(PARTY_OVERRIDES[party.name] || {}),
  profile: {
    nato: "neutral",
    migration: "moderate",
    energy: "neutral",
    governance: "medium",
    ...(party.profile || {}),
    ...((PARTY_OVERRIDES[party.name] && PARTY_OVERRIDES[party.name].profile) || {}),
  },
}));

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
  {
    id: 1,
    text: "Данъците в България трябва да бъдат намалени.",
    dimension: "taxes",
    agreementLabel: "намаляване на данъците",
    getIdealValue: (p) => ({ low: 5, medium: 3, high: 1 }[p.profile.taxes] ?? 3),
  },
  {
    id: 2,
    text: "Трябва да се въведе прогресивен данък (по-богатите да плащат по-висок процент).",
    dimension: "taxes",
    agreementLabel: "прогресивно облагане",
    getIdealValue: (p) => ({ high: 5, medium: 3, low: 1 }[p.profile.taxes] ?? 3),
  },
  {
    id: 3,
    text: "Държавата трябва да има по-голяма роля в икономиката.",
    dimension: "state",
    agreementLabel: "силна роля на държавата в икономиката",
    getIdealValue: (p) => ({ high: 5, medium: 3, low: 1 }[p.profile.state] ?? 3),
  },
  {
    id: 4,
    text: "Социалните помощи за хора с ниски доходи трябва да се увеличат.",
    dimension: "state",
    agreementLabel: "повече социални помощи",
    getIdealValue: (p) => ({ high: 5, medium: 3, low: 1 }[p.profile.state] ?? 3),
  },
  {
    id: 5,
    text: "България трябва да бъде силно интегрирана в Европейския съюз.",
    dimension: "eu",
    agreementLabel: "силна интеграция в ЕС",
    getIdealValue: (p) => ({ pro: 5, neutral: 3, skeptic: 1 }[p.profile.eu] ?? 3),
  },
  {
    id: 6,
    text: "България трябва да поддържа по-близки политически и икономически отношения с Русия.",
    dimension: "russia",
    agreementLabel: "по-близки отношения с Русия",
    getIdealValue: (p) => ({ close: 5, neutral: 3, far: 1 }[p.profile.russia] ?? 3),
  },
  {
    id: 7,
    text: "Членството в НАТО е важно за сигурността на България.",
    dimension: "security",
    agreementLabel: "подкрепа за НАТО",
    getIdealValue: (p) => ({ pro: 5, neutral: 3, skeptic: 1 }[p.profile.nato] ?? 3),
  },
  {
    id: 8,
    text: "Миграционната политика трябва да бъде по-строга.",
    dimension: "security",
    agreementLabel: "по-строга миграционна политика",
    getIdealValue: (p) => ({ strict: 5, moderate: 3, open: 1 }[p.profile.migration] ?? 3),
  },
  {
    id: 9,
    text: "България трябва да инвестира повече в ядрена енергетика.",
    dimension: "energy",
    agreementLabel: "ядрена енергетика",
    getIdealValue: (p) => ({ pro: 5, neutral: 3, low: 1 }[p.profile.energy] ?? 3),
  },
  {
    id: 10,
    text: "Трябва да има по-строги мерки срещу корупцията в институциите.",
    dimension: "governance",
    agreementLabel: "силна антикорупционна политика",
    getIdealValue: (p) => ({ high: 5, medium: 3, low: 1 }[p.profile.governance] ?? 3),
  },
];

const adPackages = [
  {
    key: "basic",
    name: "Basic",
    price: "250 € / седмица",
    description: "Банер 970×90 на видима позиция след основното съдържание.",
  },
  {
    key: "premium",
    name: "Premium",
    price: "350 € / седмица",
    description: "Банер + допълнително споменаване под основно съдържание като спонсор на седмицата.",
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
    description: "Различен размер на банера, времетраене или локация.",
  },
];

const BLOG_POSTS = [
  {
    slug: "kak-da-izberem-partiya",
    title: "Как да изберем партия според собствените си приоритети",
    excerpt: "Практичен подход за избор на партия без лозунги и без излишен шум.",
    content: [
      "Изборът на партия е по-лесен, когато първо подредите собствените си приоритети. За едни хора най-важни са данъците и доходите, за други – сигурността, ЕС, Русия, антикорупцията или социалната политика.",
      "Полезно е да гледате не само обещанията, а и цялостния профил на една формация. Една партия може да звучи убедително по една тема, но да е далеч от вашите възгледи по други въпроси.",
      "Точно затова инструменти като теста и страниците за сравнение помагат – те дават по-подредена картина и ви спестяват време."
    ]
  },
  {
    slug: "kakvo-oznachava-lyavo-i-dyasno",
    title: "Какво означава ляво и дясно в българската политика",
    excerpt: "Кратко обяснение на разликите между ляв и десен политически подход.",
    content: [
      "Лявото и дясното най-често се различават по ролята на държавата, данъците и социалната политика. Левият модел обикновено подкрепя по-голямо преразпределение и по-силна роля на държавата.",
      "Десният модел по-често защитава по-ниски данъци, по-свободна икономическа инициатива и по-ограничена държавна намеса. В реалната политика обаче много партии комбинират елементи и от двете посоки.",
      "В България към това се добавят и теми като ЕС, Русия, антикорупция и сигурност, които правят картината още по-многопластова."
    ]
  },
  {
    slug: "zashto-partiinite-programi-sa-trudni-za-sravnenie",
    title: "Защо партийните програми често са трудни за сравнение",
    excerpt: "Как различният стил и различната конкретика правят сравняването трудно.",
    content: [
      "Партийните програми рядко са написани по еднакъв начин. Някои са кратки и лозунгови, други са дълги и технически, а трети използват много общ език.",
      "Това прави директното сравнение трудно, особено за човек, който няма време да чете десетки страници. Затова е полезно програмите да се превеждат в по-ясни тематични позиции.",
      "Подреденото сравнение по теми като данъци, ЕС, Русия, сигурност и енергетика прави разликите по-видими."
    ]
  }
];

const PARTY_ARTICLES = [
  {
    slug: "gerb-sds",
    partyName: "ГЕРБ-СДС",
    priority: 2,
    title: "ГЕРБ-СДС – история, програма и политически профил",
    description: "Подробен профил на ГЕРБ-СДС с акцент върху програмните приоритети, управленския профил и позициите по ключови теми.",
    officialSite: "https://gerb.bg/",
    programLink: "https://gerb.bg/",
    history: [
      "ГЕРБ е основана през 2006 г., а коалиционният формат ГЕРБ-СДС се утвърждава като дясноцентристка и проевропейска изборна конфигурация.",
      "Формацията има дълъг управленски опит и е сред най-разпознаваемите политически сили в страната през последните години."
    ],
    content: [
      "Програмните приоритети са стабилност, сигурност, модернизация и интеграция в ЕС и еврозоната.",
      "Платформата поставя акцент върху инфраструктура, бизнес среда, образование, здравеопазване и по-строг контрол по сигурността и границите.",
      "Профилът е по-близо до умерено дясноцентристки модел с предвидима данъчна среда и проевропейска ориентация."
    ]
  },
  {
    slug: "pp-db",
    partyName: "ПРОДЪЛЖАВАМЕ ПРОМЯНАТА – ДЕМОКРАТИЧНА БЪЛГАРИЯ",
    priority: 3,
    title: "ПП-ДБ – програма, приоритети и политически профил",
    description: "Подробен профил на ПП-ДБ с акцент върху програмата, съдебната реформа, европейската интеграция и антикорупционните мерки.",
    officialSite: "https://www.ppdb.bg/",
    programLink: "https://ppdb.bg/programa-detajl/",
    history: [
      "Коалицията ПП-ДБ съчетава реформаторския и проевропейски профил на две водещи политически сили, които работят в общ формат в последните изборни цикли.",
      "Тя се позиционира като модернизационна и антикорупционна коалиция с акцент върху институционалната реформа."
    ],
    content: [
      "Програмата поставя акцент върху съдебна реформа, върховенство на правото, модернизация на икономиката и по-добро управление на публичните ресурси.",
      "Формацията е силно проевропейска и подкрепя интеграцията на България в ЕС и еврозоната.",
      "По ключови теми профилът е по-близо до проевропейски, реформаторски и институционално ориентиран модел."
    ]
  },
  {
    slug: "dps",
    partyName: "ДВИЖЕНИЕ ЗА ПРАВА И СВОБОДИ",
    title: "ДПС – програма 2026 и политически профил",
    description: "Подробен профил на ДПС с акцент върху Програма 2026, държавност, просперитет и сигурност.",
    officialSite: "https://www.dps.bg/",
    programLink: "https://www.dps.bg/izbori-2026/izborna-programa-2026.html",
    history: [
      "ДПС е основана в началото на прехода и е една от най-дълго съществуващите политически сили в съвременна България.",
      "Формацията традиционно се позиционира като прагматична, проевропейска и ориентирана към стабилност и регионално развитие."
    ],
    content: [
      "Програма 2026 на ДПС е представена под мотото „Държавност, просперитет, сигурност за хората“.",
      "В нея се поставя акцент върху икономическото развитие, сигурността, институционалната стабилност и подобряване на качеството на живот.",
      "По ключови теми профилът е по-умерен, проевропейски и прагматичен."
    ]
  },
  {
    slug: "sinya-bulgaria",
    partyName: "СИНЯ БЪЛГАРИЯ",
    title: "Синя България – програма и десен профил",
    description: "Подробен профил на Синя България с акцент върху официалната програма и дясно-консервативната ориентация.",
    officialSite: "https://sinyabulgaria.bg/",
    programLink: "https://sinyabulgaria.bg/programa/",
    history: [
      "Синя България е коалиционен проект в дясното пространство, който се опитва да събере консервативно и проевропейско ориентирани избиратели.",
      "Политическият ѝ образ е свързан с акцент върху свобода, ограничена роля на държавата и ясно дистанциране от леви модели."
    ],
    content: [
      "Официалната програма описва Синя България като консервативен десен политически съюз.",
      "Тя подкрепя ниски и предвидими данъци, ограничена роля на държавата в икономиката, силна евроатлантическа ориентация и по-строг контрол по въпросите на сигурността.",
      "По ключови въпроси формацията е сред най-ясно дясноориентираните и проевропейски коалиции."
    ]
  }
];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const ADS_ALLOWED_PAGES = new Set([
  "home",
  "party-page",
  "blog",
  "blog-post"
]);

function normalizeAnswer(value) {
  return value >= 4 ? 1 : value <= 2 ? -1 : 0;
}

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

function ensureAdsenseScript() {
  if (document.querySelector('script[data-adsense="true"]')) return;

  const adsScript = document.createElement("script");
  adsScript.async = true;
  adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2974245059167035";
  adsScript.crossOrigin = "anonymous";
  adsScript.setAttribute("data-adsense", "true");
  document.head.appendChild(adsScript);
}

function pushAdsIfNeeded() {
  try {
    const adNodes = document.querySelectorAll(".adsbygoogle");
    adNodes.forEach((node) => {
      if (!node.getAttribute("data-adsbygoogle-status")) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      }
    });
  } catch {}
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9а-яА-Я]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildFallbackPartyArticle(party) {
  if (!party) return null;

  return {
    slug: slugify(party.name),
    partyName: party.name,
    title: `${party.name} – профил, позиции и участие`,
    description: `Обобщен профил на ${party.name} с информация за приоритети, позиции по ключови теми и общ политически образ.`,
    officialSite: party.officialWebsite || null,
    programLink: party.officialProgramUrl || null,
    history: [
      `${party.name} е регистрирана политическа формация за парламентарните избори през 2026 г. и присъства в официалните регистри на ЦИК.`,
      `Публичната информация за формацията е обобщена на база налични източници, като при ограничени данни това е отбелязано изрично.`
    ],
    content: [
      `Икономически профил: ${party.economy}`,
      `Позиция по ЕС: ${party.eu}`,
      `Позиция по Русия и сигурността: ${party.russia}${party.nato ? ` ${party.nato}` : ""}`,
      `Енергетика, миграция и данъци: ${party.energy} ${party.migration} ${party.taxes}`
    ]
  };
}

function getPathState(pathname) {
  if (pathname === "/") return { page: "home", selectedParty: null, selectedBlog: null };
  if (pathname === "/compare") return { page: "compare", selectedParty: null, selectedBlog: null };
  if (pathname === "/map") return { page: "map", selectedParty: null, selectedBlog: null };
  if (pathname === "/about") return { page: "about", selectedParty: null, selectedBlog: null };
  if (pathname === "/privacy") return { page: "privacy", selectedParty: null, selectedBlog: null };
  if (pathname === "/contact") return { page: "contact", selectedParty: null, selectedBlog: null };
  if (pathname === "/advertise") return { page: "advertise", selectedParty: null, selectedBlog: null };
  if (pathname === "/methodology") return { page: "methodology", selectedParty: null, selectedBlog: null };
  if (pathname === "/analysis") return { page: "analysis", selectedParty: null, selectedBlog: null };
  if (pathname === "/how-to-vote") return { page: "how-to-vote", selectedParty: null, selectedBlog: null };
  if (pathname === "/terms") return { page: "terms", selectedParty: null, selectedBlog: null };
  if (pathname === "/news") return { page: "news", selectedParty: null, selectedBlog: null };
  if (pathname === "/disclaimer") return { page: "disclaimer", selectedParty: null, selectedBlog: null };
  if (pathname === "/kak-raboti-testa") return { page: "guide", selectedParty: null, selectedBlog: null };
  if (pathname === "/blog") return { page: "blog", selectedParty: null, selectedBlog: null };
  if (pathname.startsWith("/blog/")) {
    const slug = pathname.replace("/blog/", "");
    return { page: "blog-post", selectedParty: null, selectedBlog: BLOG_POSTS.find((p) => p.slug === slug) || null };
  }
  if (pathname === "/partii") return { page: "party-hub", selectedParty: null, selectedBlog: null };
  if (pathname.startsWith("/partii/")) {
    const slug = pathname.replace("/partii/", "");
    const article = PARTY_ARTICLES.find((p) => p.slug === slug);
    const party = article
      ? parties.find((p) => p.name === article.partyName) || null
      : parties.find((p) => slugify(p.name) === slug) || null;
    return { page: "party-page", selectedParty: party, selectedBlog: null };
  }
  return { page: "home", selectedParty: null, selectedBlog: null };
}

function navigateTo(path, setCurrentPage, setSelectedParty, setSelectedBlog, push = true) {
  if (push) window.history.pushState({}, "", path);
  const state = getPathState(path);
  setCurrentPage(state.page);
  setSelectedParty(state.selectedParty);
  setSelectedBlog(state.selectedBlog);
}

function NewsSection({ news, isLoading }) {
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

function PartyCards({ search, selectedPartyName, onSelectParty, parties, onOpenArticle }) {
  const filtered = parties.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filtered.map((party) => {
        const article = PARTY_ARTICLES.find((a) => a.partyName === party.name);
        return (
          <div key={party.name} className="space-y-3">
            <button type="button" onClick={() => onSelectParty?.(party)} className="text-left w-full">
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
            {article && <Button variant="outline" className="w-full" onClick={() => onOpenArticle?.(article.slug)}>Подробен профил</Button>}
          </div>
        );
      })}
    </div>
  );
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
    </div>
  );
}

function VotingQuiz({ parties }) {
  const [answers, setAnswers] = useState(Object.fromEntries(questions.map((q) => [q.id, 3])));
  const [result, setResult] = useState(null);
  const [selectedInsightParty, setSelectedInsightParty] = useState(null);
  const [shareMessage, setShareMessage] = useState("");

  const answeredCount = Object.values(answers).filter((value) => value !== 3).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const buildPoliticalProfile = () => {
    const avgFor = (dimension) => {
      const values = questions
        .filter((question) => question.dimension === dimension)
        .map((question) => normalizeAnswer(answers[question.id] ?? 3))
        .filter((value) => value !== 0);

      if (values.length === 0) return 0;
      return values.reduce((sum, value) => sum + value, 0) / values.length;
    };

    const taxesAvg = avgFor("taxes");
    const stateAvg = avgFor("state");
    const euAvg = avgFor("eu");
    const russiaAvg = avgFor("russia");

    return {
      economy: taxesAvg > 0.2 ? "по-скоро ниски данъци" : taxesAvg < -0.2 ? "по-скоро по-високо облагане" : "умерен данъчен профил",
      state: stateAvg > 0.2 ? "по-силна социална държава" : stateAvg < -0.2 ? "по-ограничена роля на държавата" : "умерен държавен профил",
      eu: euAvg > 0.2 ? "проевропейски" : euAvg < -0.2 ? "по-скептичен към ЕС" : "умерен към ЕС",
      russia: russiaAvg > 0.2 ? "по-отворен към по-близки отношения с Русия" : russiaAvg < -0.2 ? "по-дистанциран от Русия" : "умерен по темата Русия",
    };
  };

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const getAnswerLabel = (value) => {
    const normalized = normalizeAnswer(value);
    if (normalized === 1) return "Да";
    if (normalized === -1) return "Не";
    return "Не се интересувам";
  };

  const getMatchPoints = (answer, ideal) => {
    const normalizedAnswer = normalizeAnswer(answer);
    const normalizedIdeal = normalizeAnswer(ideal);
    if (normalizedAnswer === 0 || normalizedIdeal === 0) return 1;
    return normalizedAnswer === normalizedIdeal ? 2 : 0;
  };

  const buildPartyInsight = (party) => {
    const details = questions.map((question) => {
      const answer = answers[question.id] ?? 3;
      const partyAnswerMeta = getPartyAnswerForQuestion(party, question);
      const ideal = partyAnswerMeta.value;
      const normalizedAnswer = normalizeAnswer(answer);
      const normalizedIdeal = normalizeAnswer(ideal);
      const distance = normalizedAnswer === normalizedIdeal ? 0 : normalizedAnswer === 0 || normalizedIdeal === 0 ? 1 : 2;
      const points = getMatchPoints(answer, ideal);

      return {
        id: question.id,
        text: question.text,
        answer,
        ideal,
        distance,
        points,
        sourceLabel: partyAnswerMeta.sourceLabel,
        isStrongMatch: distance <= 1,
        explanation: (() => {
          const partyPosition = ideal >= 4
            ? `позицията на партията е „подкрепя ${question.agreementLabel}“`
            : ideal <= 2
            ? `позицията на партията е „по-скоро е против ${question.agreementLabel}“`
            : `позицията на партията е по-умерена по темата „${question.agreementLabel}“`;

          if (distance === 0) return `Вашият отговор съвпада с позицията на ${party.name}. По този въпрос ${partyPosition}.`;
          if (distance === 1) return `${party.name} е частично близо до вашата позиция. По този въпрос ${partyPosition}, докато вашият отговор е „${getAnswerLabel(answer)}“.`;
          return `Имате разминаване с ${party.name}. По този въпрос ${partyPosition}, а вашият отговор е „${getAnswerLabel(answer)}“.`;
        })(),
      };
    });

    const strongestMatches = details.filter((item) => item.isStrongMatch).sort((a, b) => a.distance - b.distance || b.points - a.points).slice(0, 3);
    const biggestDifferences = details.filter((item) => item.distance >= 2).sort((a, b) => b.distance - a.distance || a.points - b.points).slice(0, 3);
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
          const ideal = partyAnswerMeta.value;
          const normalizedAnswer = normalizeAnswer(answer);
          const normalizedIdeal = normalizeAnswer(ideal);
          score += getMatchPoints(answer, ideal);
          totalDistance += Math.abs(normalizedAnswer - normalizedIdeal);
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
        await navigator.share({ title: "Моят резултат от теста за партиите", text, url: window.location.href });
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
      <div className="space-y-3">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Тест: За коя партия съвпадат вижданията ви?</h2>
          <p className="text-sm text-muted-foreground">Отговорете на всеки въпрос с една от трите опции: „Да“, „Не“ или „Не се интересувам“.</p>
        </div>

        <div className="rounded-2xl border p-4 bg-muted/30 space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">Напредък</span>
            <span className="text-muted-foreground">{answeredCount} от {questions.length} въпроса</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="text-xs text-muted-foreground">{progressPercent}% попълнен тест</div>
        </div>
      </div>

      {questions.map((q) => {
        const value = answers[q.id] ?? 3;
        return (
          <div key={q.id} className="border rounded-xl p-4 space-y-4">
            <div className="font-medium">{q.text}</div>
            <div className="px-2">
              <div className="flex gap-2 flex-wrap">
                <Button variant={value === 5 ? "default" : "outline"} onClick={() => handleAnswer(q.id, 5)}>Да</Button>
                <Button variant={value === 3 ? "default" : "outline"} onClick={() => handleAnswer(q.id, 3)}>Не се интересувам</Button>
                <Button variant={value === 1 ? "default" : "outline"} onClick={() => handleAnswer(q.id, 1)}>Не</Button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex gap-3 flex-wrap">
        <Button onClick={calculate}>Виж резултат</Button>
        <Button variant="secondary" onClick={shareResult} disabled={!result?.best}>Сподели резултата</Button>
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

      {shareMessage && <div className="rounded-xl border bg-muted/50 p-3 text-sm text-muted-foreground">{shareMessage}</div>}

      {result && (
        <div className="space-y-4">
          <div className="rounded-2xl border p-5 bg-background space-y-3">
            <h3 className="text-lg font-semibold">Вашият политически профил</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border p-3"><strong>Икономика:</strong> {buildPoliticalProfile().economy}</div>
              <div className="rounded-xl border p-3"><strong>Държава:</strong> {buildPoliticalProfile().state}</div>
              <div className="rounded-xl border p-3"><strong>ЕС:</strong> {buildPoliticalProfile().eu}</div>
              <div className="rounded-xl border p-3"><strong>Русия:</strong> {buildPoliticalProfile().russia}</div>
            </div>
          </div>

          <div className="p-6 border rounded-2xl bg-muted">
            <strong>Най-близката партия до вашите виждания:</strong>
            <div className="mt-4 flex items-center gap-3 rounded-xl border bg-background p-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${result.best.logoClass}`}>{result.best.logoText}</div>
              <div>
                <div className="text-2xl font-bold">{result.best.name}</div>
                <div className="text-sm text-muted-foreground">{result.best.percent}% съвпадение · {result.best.score} от {questions.length * 2} точки</div>
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
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${party.logoClass}`}>{party.logoText}</div>
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
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold ${selectedInsightParty.logoClass}`}>{selectedInsightParty.logoText}</div>
                  <div>
                    <CardTitle>Защо {selectedInsightParty.name} е на тази позиция</CardTitle>
                    <div className="text-sm text-muted-foreground">{selectedInsightParty.percent}% съвпадение · {selectedInsightParty.score} от {questions.length * 2} точки</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-sm">
                <div className="space-y-2">
                  <Badge variant={selectedInsightParty.officialQuizAnswers ? "secondary" : "outline"}>{selectedInsightParty.matchMethod}</Badge>
                  <p className="text-muted-foreground">{selectedInsightParty.insight.summary}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Къде съвпадате най-много</h3>
                    {selectedInsightParty.insight.strongestMatches.length > 0 ? selectedInsightParty.insight.strongestMatches.map((item) => (
                      <div key={item.id} className="rounded-xl border p-3 space-y-2">
                        <Badge variant="secondary">Силно съвпадение</Badge>
                        <div className="font-medium">{item.text}</div>
                        <div className="text-muted-foreground">{item.explanation}</div>
                        <div className="text-xs text-muted-foreground">Ваш отговор: {getAnswerLabel(item.answer)} · Отговор на партията: {getAnswerLabel(item.ideal)} · {item.points} от 2 точки</div>
                        <div className="text-[11px] text-muted-foreground">{item.sourceLabel}</div>
                      </div>
                    )) : <div className="rounded-xl border p-3 text-muted-foreground">Няма изразени силни съвпадения по текущите отговори.</div>}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Къде се различавате</h3>
                    {selectedInsightParty.insight.biggestDifferences.length > 0 ? selectedInsightParty.insight.biggestDifferences.map((item) => (
                      <div key={item.id} className="rounded-xl border p-3 space-y-2">
                        <Badge variant="outline">Разминаване</Badge>
                        <div className="font-medium">{item.text}</div>
                        <div className="text-muted-foreground">{item.explanation}</div>
                        <div className="text-xs text-muted-foreground">Ваш отговор: {getAnswerLabel(item.answer)} · Отговор на партията: {getAnswerLabel(item.ideal)} · {item.points} от 2 точки</div>
                        <div className="text-[11px] text-muted-foreground">{item.sourceLabel}</div>
                      </div>
                    )) : <div className="rounded-xl border p-3 text-muted-foreground">Няма големи разминавания по текущите отговори.</div>}
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
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("economy");
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);

  const sortedParties = useMemo(
    () => [...parties].sort((a, b) => {
      const pa = a.priority ?? 999;
      const pb = b.priority ?? 999;
      if (pa !== pb) return pa - pb;
      return a.name.localeCompare(b.name, "bg");
    }),
    []
  );
  const selectedPartyArticle = selectedParty
    ? (PARTY_ARTICLES.find((article) => article.partyName === selectedParty.name) || buildFallbackPartyArticle(selectedParty))
    : null;
  const adsAllowedOnPage = ADS_ALLOWED_PAGES.has(currentPage);
  const openPath = (path) => navigateTo(path, setCurrentPage, setSelectedParty, setSelectedBlog, true);

  useEffect(() => {
    navigateTo(window.location.pathname, setCurrentPage, setSelectedParty, setSelectedBlog, false);
    const handlePopState = () => navigateTo(window.location.pathname, setCurrentPage, setSelectedParty, setSelectedBlog, false);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    document.title = "Тест: За коя партия да гласувам? | Сравнение на партии в България";
  }, []);

  useEffect(() => {
    if (!adsAllowedOnPage) return;
    ensureAdsenseScript();
    const timer = setTimeout(() => pushAdsIfNeeded(), 400);
    return () => clearTimeout(timer);
  }, [adsAllowedOnPage, currentPage]);

  useEffect(() => {
    let isMounted = true;
    const loadNews = async () => {
      if (!supabase) return;
      setNewsLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("id,title,summary,source_name,source_url,published_at,party_name,is_published")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (!isMounted) return;
      if (!error && data) setNews(data);
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
            <p className="text-muted-foreground max-w-2xl">Независим инструмент за сравнение на политическите платформи.</p>
            <div className="text-sm text-muted-foreground max-w-4xl space-y-4">
              <p><strong>Тест: За коя партия да гласувам?</strong> Отговорете на въпросите по-долу и вижте коя политическа програма е най-близо до вашите виждания. Целта на този сайт е да улесни избирателите, които искат бързо, ясно и неутрално сравнение между основните партии и коалиции в България.</p>
              <p>Сайтът сравнява позициите на партиите по ключови теми като икономика, данъци, социална политика, ЕС, Русия, сигурност, енергетика и миграция. Вместо потребителят да търси информация в десетки различни източници, тук основните различия са подредени в по-лесен за сравнение формат.</p>
              <p>Тестът не е официален инструмент на държавна институция и не дава указания за гласуване. Той служи като ориентир, който помага да видите кои партии са по-близо до вашите отговори по конкретни обществени въпроси.</p>
              <p>Освен самия тест, Izborite.info включва страници с методология, подробни профили на основни партии, блог статии, обяснения как да използвате резултатите, както и секция с новини.</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant={currentPage === "home" ? "default" : "outline"} onClick={() => openPath("/")}>Тест</Button>
            <Button variant={currentPage === "compare" ? "default" : "outline"} onClick={() => openPath("/compare")}>Сравнение на партии</Button>
            <Button variant={currentPage === "map" ? "default" : "outline"} onClick={() => openPath("/map")}>Карта ЕС и Русия</Button>
            <Button variant={currentPage === "party-hub" || currentPage === "party-page" ? "default" : "outline"} onClick={() => openPath("/partii")}>Основни партии</Button>
            <Button variant={currentPage === "blog" || currentPage === "blog-post" ? "default" : "outline"} onClick={() => openPath("/blog")}>Блог</Button>
            <Button variant={currentPage === "about" ? "default" : "outline"} onClick={() => openPath("/about")}>За сайта</Button>
            <Button variant={currentPage === "privacy" ? "default" : "outline"} onClick={() => openPath("/privacy")}>Поверителност</Button>
            <Button variant={currentPage === "contact" ? "default" : "outline"} onClick={() => openPath("/contact")}>Контакт</Button>
            <Button variant={currentPage === "advertise" ? "default" : "outline"} onClick={() => openPath("/advertise")}>Реклама</Button>
            <Button variant={currentPage === "methodology" ? "default" : "outline"} onClick={() => openPath("/methodology")}>Методология</Button>
            <Button variant={currentPage === "guide" ? "default" : "outline"} onClick={() => openPath("/kak-raboti-testa")}>Как работи тестът</Button>
            <Button variant={currentPage === "analysis" ? "default" : "outline"} onClick={() => openPath("/analysis")}>Как сравняваме партиите</Button>
            <Button variant={currentPage === "how-to-vote" ? "default" : "outline"} onClick={() => openPath("/how-to-vote")}>Как да избера партия</Button>
            <Button variant={currentPage === "terms" ? "default" : "outline"} onClick={() => openPath("/terms")}>Условия</Button>
            <Button variant={currentPage === "news" ? "default" : "outline"} onClick={() => openPath("/news")}>Новини</Button>
            <Button variant={currentPage === "disclaimer" ? "default" : "outline"} onClick={() => openPath("/disclaimer")}>Дисклеймър</Button>
          </div>
        </div>

        {currentPage === "compare" && (
          <div className="flex gap-4 flex-wrap">
            <Input placeholder="Търси партия..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
            <Select onValueChange={setTopic} defaultValue="economy">
              <SelectTrigger className="w-56"><SelectValue placeholder="Избери тема" /></SelectTrigger>
              <SelectContent>{topics.map((t) => <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
      </header>

      {currentPage === "home" ? (
        <section className="grid xl:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
          <div className="space-y-6">
            <VotingQuiz parties={sortedParties} />

            <div className="rounded-2xl border p-5 bg-muted/30 text-sm text-muted-foreground space-y-4 max-w-4xl">
              <h3 className="font-semibold text-foreground">Как работи тестът</h3>
              <p>Тестът сравнява вашите отговори с позициите на политическите партии по ключови теми като икономика, данъци, социална политика, Европейски съюз, Русия, сигурност, енергетика и миграция. Вместо да четете десетки различни програми, интервюта и постове, тук виждате по-ясно в кои посоки вашите възгледи се доближават до дадена формация.</p>
              <p>Когато изберете отговор, системата го съпоставя с предварително дефиниран профил на всяка партия. При силно съвпадение формацията получава повече точки, а при противоположни позиции се отчита разминаване. Резултатът не е политически съвет, а ориентир, който ви помага да структурирате собственото си мислене.</p>
              <p>Политическите тестове са най-полезни, когато се използват като първа стъпка. След резултата е добре да разгледате подробните профили на партиите, аналитичните страници и блог статиите, за да видите защо една формация се подрежда по-близо до вас и по кои теми имате най-голямо съвпадение.</p>
              <p>Въпросите в теста обхващат теми, които често разделят избирателите: данъци, роля на държавата, ЕС, Русия, миграция, сигурност и енергетика. Това прави резултата по-полезен от абстрактни идеологически етикети и показва реални политически различия.</p>
            </div>

            <div className="rounded-2xl border p-5 bg-background space-y-4 max-w-4xl">
              <h3 className="font-semibold text-foreground text-xl">Как да четете резултата</h3>
              <p className="text-sm text-muted-foreground">Процентът съвпадение показва близост между вашите отговори и обобщения профил на партията по конкретен набор от въпроси. Това не означава, че една партия е автоматично „вашата“ партия, а че по текущите въпроси и по начина, по който сте отговорили, тя стои по-близо до вас от останалите.</p>
              <p className="text-sm text-muted-foreground">Възможно е да имате високо съвпадение с партия, към която не изпитвате доверие по други причини, или по-ниско съвпадение с формация, която все пак да ви е важна заради една ключова тема. Именно затова резултатът трябва да се използва за ориентиране, а не като окончателна присъда.</p>
              <p className="text-sm text-muted-foreground">Най-полезният подход е да разгледате къде съвпадате най-много и къде се различавате. Това ви дава по-добра представа какво точно стои зад крайния процент.</p>
            </div>

            <div className="rounded-2xl border p-5 bg-background space-y-4 max-w-4xl">
              <h3 className="font-semibold text-foreground text-xl">Често задавани въпроси</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <div className="font-medium text-foreground">Тестът официален ли е?</div>
                  <p>Не. Това е независим инструмент за сравнение и ориентиране. Когато партия предостави официални отговори, това се отбелязва отделно.</p>
                </div>
                <div>
                  <div className="font-medium text-foreground">Как се определят позициите на партиите?</div>
                  <p>Използват се публични програми, изявления, регистърът на ЦИК и други достъпни източници. При ограничена информация това се обозначава изрично.</p>
                </div>
                <div>
                  <div className="font-medium text-foreground">Трябва ли да чета и друго освен теста?</div>
                  <p>Да. Добра практика е след теста да разгледате страниците за методология, анализ, профили на партии и блог материали. Това ще ви даде по-пълна картина.</p>
                </div>
              </div>
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl border p-4 bg-background text-sm text-muted-foreground space-y-3">
              <h3 className="font-semibold text-foreground">Последни новини</h3>
              <p>Новините допълват теста с по-актуална информация за партии, кампании, публични изявления и политически теми. Те са полезни, защото показват не само дългосрочните профили на формациите, но и по-скорошните им действия и позиции.</p>
            </div>
            <NewsSection news={news.slice(0, 5)} isLoading={newsLoading} />
          </aside>
        </section>
      ) : currentPage === "news" ? (
        <section className="space-y-6 max-w-4xl">
          <div className="text-xs text-muted-foreground">Начало / Новини</div>
          <h2 className="text-2xl font-semibold">Политически новини и актуализации</h2>
          <p className="text-muted-foreground">Тази секция събира актуални публикации, свързани с изборите, политическите партии и темите, които влияят върху обществения дебат. Целта е потребителят да има достъп не само до статични профили, но и до по-динамична картина на политическата среда.</p>
          <p className="text-muted-foreground">Новините са полезни като допълнение към теста и профилите на партиите, защото показват какво се случва в момента, кои теми се изострят и какви са последните публични позиции на политическите участници.</p>
          <NewsSection news={news} isLoading={newsLoading} />
        </section>
      ) : currentPage === "compare" ? (
        <section className="space-y-6">
          <div className="space-y-3 max-w-4xl">
            <div className="text-xs text-muted-foreground">Начало / Сравнение на партии</div>
            <h2 className="text-2xl font-semibold">Сравнение на партии по теми</h2>
            <p className="text-muted-foreground">Тази страница ви позволява да сравните партиите по конкретна тема, вместо да разглеждате дълги програми една по една. Това е полезно за хора, които искат по-бързо да видят къде се различават формациите по икономика, здравеопазване, образование, ЕС, Русия, енергетика, миграция и данъци.</p>
            <p className="text-muted-foreground">Сравнението не замества официалните програми, а служи като подреден ориентир. Ако една тема е особено важна за вас, можете първо да я изберете от менюто и да видите как различните партии я представят в публичното пространство.</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Input placeholder="Търси партия..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
            <Select onValueChange={setTopic} defaultValue="economy">
              <SelectTrigger className="w-56"><SelectValue placeholder="Избери тема" /></SelectTrigger>
              <SelectContent>{topics.map((t) => <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Сравнение на програмите</h2>
            <CompareTable selectedTopic={topic} parties={sortedParties.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))} />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Информация за партиите</h2>
            <PartyCards search={search} selectedPartyName={selectedParty?.name} onSelectParty={setSelectedParty} onOpenArticle={(slug) => openPath(`/partii/${slug}`)} parties={sortedParties.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))} />
            {selectedParty && (
              <Card className="rounded-2xl border shadow-sm">
                <CardHeader><CardTitle>{selectedParty.name}</CardTitle></CardHeader>
                <CardContent className="space-y-6 text-sm">
                  <section className="space-y-2">
                    <h3 className="text-lg font-semibold">История на партията</h3>
                    <p className="text-muted-foreground">Този раздел описва основаването на партията, нейните ключови лидери през годините и важните моменти в развитието ѝ. Историческият контекст помага на избирателите да разберат как се е формирала текущата политическа идентичност и кои идеи са били устойчиви във времето.</p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-lg font-semibold">Основни приоритети</h3>
                    <p className="text-muted-foreground">Основните приоритети включват стратегическите цели на партията – икономическо развитие, социална политика, образование, здравеопазване и сигурност. Този раздел представя кои политики са в центъра на програмата и как партията планира да ги реализира.</p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-lg font-semibold">Позиции по ключови теми</h3>
                    <div className="space-y-1 text-muted-foreground">
                      <div><strong>Икономика:</strong> {selectedParty.economy}</div>
                      <div><strong>Здравеопазване:</strong> {selectedParty.healthcare}</div>
                      <div><strong>Образование:</strong> {selectedParty.education}</div>
                      <div><strong>Енергетика:</strong> {selectedParty.energy}</div>
                      <div><strong>Сигурност:</strong> {selectedParty.nato}</div>
                    </div>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-lg font-semibold">Избиратели и профил</h3>
                    <p className="text-muted-foreground">Типичният профил на избирателите включва социални групи, професионални категории и възрастови сегменти, които традиционно подкрепят партията. Това помага да се разбере към кои обществени групи са насочени политиките и комуникацията.</p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-lg font-semibold">Участия в избори</h3>
                    <p className="text-muted-foreground">Тук се описват предишни участия в парламентарни, президентски или местни избори, както и постигнатите резултати. Историята на изборните резултати дава представа за стабилността и подкрепата на партията във времето.</p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-lg font-semibold">Роля в парламента</h3>
                    <p className="text-muted-foreground">Ако партията е участвала в парламент или управление, тук се описва нейната роля – дали е била част от управляваща коалиция, опозиция или е подкрепяла конкретни политики и законодателни инициативи.</p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-lg font-semibold">Обобщение</h3>
                    <p className="text-muted-foreground">Обобщението представя кратка характеристика на партията, нейната политическа насоченост и ключови различия спрямо други формации. Това е полезно за потребители, които искат бърз ориентир преди да разгледат подробните програми.</p>
                  </section>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      ) : currentPage === "map" ? (
        <section className="space-y-4 max-w-5xl">
          <div className="space-y-3 max-w-4xl">
            <div className="text-xs text-muted-foreground">Начало / Карта ЕС и Русия</div>
            <h2 className="text-2xl font-semibold">Карта на позициите по ЕС и Русия</h2>
            <p className="text-muted-foreground">Тази визуална карта показва как различните партии и коалиции се разполагат по оста „отношение към ЕС“ и по оста „отношение към Русия“. Целта не е да се даде окончателна присъда за една формация, а да се предложи по-лесен начин за ориентиране в общата политическа картина.</p>
            <p className="text-muted-foreground">Подобна визуализация е полезна за хора, които искат бързо да видят кои партии са по-проевропейски, кои са по-скептични към по-дълбоката интеграция и как различните формации се позиционират спрямо Русия като политическа и геополитическа тема.</p>
          </div>
          <PartyPositionMap parties={sortedParties} onSelectParty={setSelectedParty} />
        </section>
      ) : currentPage === "party-hub" ? (
        <section className="space-y-6 max-w-5xl">
          <div className="text-xs text-muted-foreground">Начало / Основни партии</div>
          <h2 className="text-2xl font-semibold">Основни партии в България</h2>
          <p className="text-muted-foreground max-w-4xl">Тази секция събира по-подробни профили на основни партии и коалиции, които участват в българския политически дебат. Целта е читателят да получи по-цялостен преглед на техните приоритети, общ профил и ориентировъчни позиции по важни теми.</p>
          <p className="text-muted-foreground max-w-4xl">Профилите са създадени така, че да помогнат на потребителите да разберат не само къде стои една партия по отделни въпроси, но и как изглежда общият ѝ политически стил. Това е полезно особено за хора, които искат повече контекст след попълване на теста.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {sortedParties.map((party) => {
              const article = PARTY_ARTICLES.find((a) => a.partyName === party.name) || buildFallbackPartyArticle(party);
              return (
                <Card key={article.slug} className="rounded-2xl">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${party.logoClass}`}>
                        {party.logoText}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{party.name}</h3>
                        <div className="text-xs text-muted-foreground">{party.type === "coalition" ? "Коалиция" : "Партия"}</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{article.description}</p>
                    <Button onClick={() => openPath(`/partii/${article.slug}`)}>Прочети</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      ) : currentPage === "party-page" ? (
        <section className="space-y-6 max-w-4xl">
          {selectedPartyArticle ? (
            <>
              <div className="text-xs text-muted-foreground">Начало / Основни партии / {selectedPartyArticle.partyName}</div>
              <h2 className="text-3xl font-semibold">{selectedPartyArticle.title}</h2>
              <p className="text-muted-foreground">{selectedPartyArticle.description}</p>
              {(selectedPartyArticle.officialSite || selectedPartyArticle.programLink) && (
                <div className="flex gap-4 flex-wrap text-sm">
                  {(selectedPartyArticle.officialSite || selectedParty?.officialWebsite) && <a href={selectedPartyArticle.officialSite || selectedParty?.officialWebsite} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">Официален сайт</a>}
                  {(selectedPartyArticle.programLink || selectedParty?.officialProgramUrl) && <a href={selectedPartyArticle.programLink || selectedParty?.officialProgramUrl} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">Предизборна програма</a>}
                </div>
              )}

              <section className="space-y-3">
                <h3 className="text-xl font-semibold">История на партията</h3>
                <div className="space-y-3 text-muted-foreground">
                  {selectedPartyArticle.history?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-xl font-semibold">Профил, приоритети и позиции</h3>
                <div className="space-y-4 text-muted-foreground">{selectedPartyArticle.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
              </section>
            </>
          ) : <div className="text-muted-foreground">Страницата не беше намерена.</div>}
        </section>
      ) : currentPage === "blog" ? (
        <section className="space-y-6 max-w-5xl">
          <div className="text-xs text-muted-foreground">Начало / Блог</div>
          <h2 className="text-2xl font-semibold">Блог</h2>
          <p className="text-muted-foreground max-w-4xl">Блог секцията съдържа обяснителни текстове по теми, които често объркват избирателите – как се четат партийни програми, какво означава ляво и дясно, как да използвате политически тест, защо ЕС, Русия, сигурността и данъчната политика имат толкова голяма тежест в политическия избор.</p>
          <p className="text-muted-foreground max-w-4xl">Тук идеята е не просто да има нови текстове, а да се изгради полезна библиотека от кратки и разбираеми обяснения за политически понятия, процеси и теми, които имат значение преди избори.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {BLOG_POSTS.map((post) => (
              <Card key={post.slug} className="rounded-2xl">
                <CardContent className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  <Button onClick={() => openPath(`/blog/${post.slug}`)}>Прочети статията</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : currentPage === "blog-post" ? (
        <section className="space-y-6 max-w-4xl">
          {selectedBlog ? (
            <>
              <h2 className="text-3xl font-semibold">{selectedBlog.title}</h2>
              <p className="text-muted-foreground">{selectedBlog.excerpt}</p>
              <div className="space-y-4 text-muted-foreground">{selectedBlog.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
            </>
          ) : <div className="text-muted-foreground">Статията не беше намерена.</div>}
        </section>
      ) : currentPage === "about" ? (
        <section className="space-y-5 max-w-4xl">
          <div className="text-xs text-muted-foreground">Начало / За сайта</div>
          <h2 className="text-2xl font-semibold">За сайта</h2>
          <p className="text-muted-foreground">Izborite.info е независим информационен проект, създаден с идеята да помогне на повече хора да се ориентират по-лесно в политическите позиции на партиите и коалициите в България. Сайтът не е официален проект на институция, медия или политическа формация и не служи за агитация в полза на конкретен участник в изборите.</p>
          <p className="text-muted-foreground">Основната цел на платформата е да събере на едно място информация, която обичайно е разпръсната в партийни програми, интервюта, медийни участия, публични изявления и документи. По този начин потребителят може да види по-структурирано как различните формации се позиционират по теми като икономика, данъци, социална политика, ЕС, Русия, сигурност, енергетика и миграция.</p>
          <p className="text-muted-foreground">Проектът е насочен както към хора, които следят политиката редовно, така и към потребители, които просто искат бърз, разбираем и неутрален ориентир преди избори. Тестът, тематичните сравнения, профилите на партии, блог статиите и секцията с новини имат за цел да направят публичната информация по-достъпна и по-лесна за сравнение.</p>
          <p className="text-muted-foreground">Izborite.info не дава политически съвет. Резултатите от теста са ориентировъчни и зависят както от отговорите на потребителя, така и от наличната публична информация за формациите. Затова сайтът насърчава читателите да използват резултатите като начална точка, а не като окончателна присъда.</p>
          <p className="text-muted-foreground">При някои партии има много повече достъпна и структурирана информация, а при други публичните данни са ограничени. Когато това е така, платформата го обозначава изрично. Тази прозрачност е важна, защото целта не е да се създава привидна точност, а да се показва реалното състояние на наличните източници.</p>
        </section>
      ) : currentPage === "privacy" ? (
        <section className="space-y-5 max-w-4xl">
          <div className="text-xs text-muted-foreground">Начало / Поверителност</div>
          <h2 className="text-2xl font-semibold">Политика за поверителност</h2>
          <p className="text-muted-foreground">Сайтът използва аналитични и рекламни технологии с цел измерване на посещаемостта, подобряване на съдържанието и подпомагане на финансирането на проекта. Възможно е да се използват услуги като Google Analytics и Google AdSense, които могат да обработват технически данни като IP адрес, тип устройство, браузър, поведение в сайта и бисквитки.</p>
          <p className="text-muted-foreground">Izborite.info не изисква регистрация и не събира директно лични данни като име, телефон или имейл, освен ако потребителят не ги изпрати доброволно чрез имейл кореспонденция. Сайтът не предлага потребителски профили или затворени секции, в които да се изисква системно въвеждане на лична информация.</p>
          <p className="text-muted-foreground">Данните от аналитичните инструменти се използват за разбиране кои страници са полезни за потребителите, как се използват различните секции и къде има нужда от подобрение в съдържанието или навигацията. Това позволява проектът да се развива по-полезно и по-ясно за посетителите.</p>
          <p className="text-muted-foreground">Рекламните услуги могат да използват бисквитки за измерване и показване на реклами. Част от тези технологии зависят от приложимото законодателство, настройките на браузъра и предоставените съгласия. Потребителят винаги може да преглежда собствените си настройки за бисквитки и рекламна персонализация.</p>
          <p className="text-muted-foreground">Сайтът може да съдържа външни връзки към официални страници на партии, институции, медии и други източници. След напускане на Izborite.info обработването на данни се регулира от политиките на съответните външни сайтове.</p>
        </section>
      ) : currentPage === "methodology" ? (
        <section className="space-y-5 max-w-4xl">
          <div className="text-xs text-muted-foreground">Начало / Методология</div>
          <h2 className="text-2xl font-semibold">Методология</h2>
          <p className="text-muted-foreground">Тестът сравнява вашите отговори с позициите на партиите по десет ключови въпроса. Всеки въпрос е свързан с по-широка политическа тема, която присъства трайно в обществения дебат – данъци, роля на държавата, ЕС, Русия, сигурност, миграция, енергетика и антикорупционни мерки.</p>
          <p className="text-muted-foreground">За всяка партия се използва профил, който може да бъде изграден по два начина: чрез официално предоставени отговори по въпросника или чрез оценка на база публични данни и тематични позиции. Когато има официален въпросник, той се използва с приоритет. Когато няма, се използва по-ориентировъчен модел на съпоставка.</p>
          <p className="text-muted-foreground">Сайтът не представя автоматично генерирани предположения като официални факти. Именно затова при формации с ограничена публична информация това е обозначено изрично. Подобен подход е по-честен към потребителя и по-полезен от привидно прецизна, но слабо обоснована категоризация.</p>
          <p className="text-muted-foreground">Съвпадението се изчислява на база близост между вашите отговори и профила на партията. Крайният процент е ориентир за близост, а не политическа препоръка.</p>
        </section>
      ) : currentPage === "guide" ? (
        <section className="space-y-5 max-w-4xl">
          <div className="text-xs text-muted-foreground">Начало / Как работи тестът</div>
          <h2 className="text-2xl font-semibold">Как работи тестът</h2>
          <p className="text-muted-foreground">Тестът е помощен инструмент за ориентиране в политическите позиции на основните партии и коалиции. Вместо да се налага да четете голям брой документи, интервюта и изявления, тук можете по-бързо да видите кои формации са по-близо до вашите възгледи по определени теми.</p>
          <p className="text-muted-foreground">Всеки въпрос в теста е подбран така, че да отразява по-широк обществен спор. Това прави резултата по-полезен от чисто общи или абстрактни въпроси, защото показва реални разделителни линии в политическия дебат. Целта не е да се даде абсолютна оценка, а по-добра отправна точка.</p>
          <p className="text-muted-foreground">След приключване на теста виждате не само коя партия е най-близо до вас, но и по кои теми съвпадате най-силно и къде имате по-сериозни различия. Това е важна част от ползата на подобен инструмент, защото съвпадението рядко е еднакво по всички въпроси.</p>
          <p className="text-muted-foreground">Най-добрият начин да използвате резултата е като първа стъпка. След това е полезно да прегледате профилите на партиите, блог секцията и обяснителните страници в сайта.</p>
        </section>
      ) : currentPage === "analysis" ? (
        <section className="space-y-5 max-w-4xl">
          <div className="text-xs text-muted-foreground">Начало / Как сравняваме партиите</div>
          <h2 className="text-2xl font-semibold">Как сравняваме партиите</h2>
          <p className="text-muted-foreground">Сайтът използва публични източници и структурирани тематични профили, за да направи политическите различия по-видими и по-лесни за сравнение. Вместо да възпроизвежда дълги партийни текстове, платформата обобщава основните позиции по ключови теми.</p>
          <p className="text-muted-foreground">Този подход е полезен, защото в реалната политическа среда информацията често е неравномерна. Някои партии публикуват подробни програми, други разчитат повече на медийни участия и кратки изявления. Именно затова сравнението трябва да бъде подредено и честно спрямо наличните данни.</p>
          <p className="text-muted-foreground">Когато информацията е ограничена, това се отбелязва изрично. Така сайтът не създава фалшива симетрия между формации с добре документирани политики и такива, за които публичната конкретика е по-малка.</p>
          <p className="text-muted-foreground">Целта е потребителят да получи по-ясна картина за общия профил на всяка формация, а след това при желание да отвори официални източници и да навлезе в по-голяма дълбочина.</p>
        </section>
      ) : currentPage === "how-to-vote" ? (
        <section className="space-y-5 max-w-4xl">
          <div className="text-xs text-muted-foreground">Начало / Как да избера партия</div>
          <h2 className="text-2xl font-semibold">Как да избера партия</h2>
          <p className="text-muted-foreground">Подреждането на собствените приоритети е най-добрата първа стъпка при избора на партия. За някои хора най-важни са данъците и икономиката, за други – социалната защита, сигурността, ЕС, борбата с корупцията или външната политика. Ако не знаете откъде да започнете, опитайте се да определите две или три теми, които имат най-голяма тежест за вас.</p>
          <p className="text-muted-foreground">След това е полезно да сравните не само едно обещание или лозунг, а общия профил на формациите. Понякога една партия изглежда близка по една тема, но далеч по няколко други. Именно затова структурираните профили и тестът могат да бъдат полезни – те показват по-широката картина.</p>
          <p className="text-muted-foreground">Добра практика е след попълване на теста да разгледате подробните профили, блог статиите и новините. Така ще видите не само с кого съвпадате, но и защо.</p>
          <p className="text-muted-foreground">Окончателното решение винаги трябва да бъде ваше. Този сайт е създаден да подпомага ориентацията, а не да замества личната преценка.</p>
        </section>
      ) : currentPage === "terms" ? (
        <section className="space-y-5 max-w-4xl">
          <div className="text-xs text-muted-foreground">Начало / Условия</div>
          <h2 className="text-2xl font-semibold">Условия</h2>
          <p className="text-muted-foreground">Съдържанието на сайта е с информативен характер и е предназначено да подпомага ориентирането на потребителите в публично достъпните политически позиции на партиите и коалициите в България. Платформата не представлява официална институция и не дава политически съвет.</p>
          <p className="text-muted-foreground">Резултатите от теста са ориентировъчни и не следва да се тълкуват като официална препоръка за гласуване. Те отразяват съпоставка между отговорите на потребителя и наличните публични профили на формациите в рамките на конкретна методология.</p>
          <p className="text-muted-foreground">Възможно е при някои формации да има по-ограничена публична информация. В такива случаи сайтът обозначава това и не претендира за пълна еднаквост на данните между всички участници.</p>
          <p className="text-muted-foreground">Използването на сайта означава, че приемате съдържанието му като помощен информационен ресурс. Външните линкове се предоставят за удобство.</p>
        </section>
      ) : currentPage === "contact" ? (
        <section className="space-y-5 max-w-4xl">
          <div className="text-xs text-muted-foreground">Начало / Контакт</div>
          <h2 className="text-2xl font-semibold">Контакт</h2>
          <p className="text-muted-foreground">На този адрес може да изпращате предложения за корекции, уточнения по профилите на партиите, липсващи официални линкове, сигнали за неточности и въпроси относно методологията на теста. Възможни са и запитвания за съдържателни предложения, технически проблеми и сътрудничество.</p>
          <p className="text-muted-foreground">Ако представлявате партия, коалиция или екип и желаете да предоставите официални отговори по въпросника, допълнителен публичен документ или корекция на фактическа неточност, можете да използвате същия имейл.</p>
          <p className="font-semibold">contact@izborite.info</p>
        </section>
      ) : currentPage === "disclaimer" ? (
        <section className="space-y-5 max-w-4xl">
          <div className="text-xs text-muted-foreground">Начало / Дисклеймър</div>
          <h2 className="text-2xl font-semibold">Дисклеймър</h2>
          <p className="text-muted-foreground">Izborite.info е независим информационен сайт и не представлява политическа партия, коалиция, кандидат, държавна институция или официална изборна платформа. Сайтът не агитира в полза на конкретен политически участник и не предоставя официални изборни резултати.</p>
          <p className="text-muted-foreground">Публикуваното съдържание има за цел да подпомогне по-доброто разбиране на публично заявени политически позиции чрез сравнение, обяснителни текстове и тематични профили. Резултатите от теста и сравнителните материали следва да се разглеждат като ориентир, а не като окончателен съвет за гласуване.</p>
          <p className="text-muted-foreground">При някои формации публичната информация е по-пълна, а при други по-ограничена. Когато това е така, сайтът се стреми да го отбелязва ясно. Целта е да се избягва представянето на предположения като сигурни факти.</p>
          <p className="text-muted-foreground">Потребителите се насърчават да използват платформата като начална точка и при нужда да преглеждат и официални източници, партийни програми, интервюта и публични документи.</p>
        </section>
      ) : (
        <section className="space-y-6 max-w-4xl">
          <h2 className="text-2xl font-semibold">Реклама в сайта</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
            {adPackages.map((pkg) => (
              <div key={pkg.key} className="border rounded-xl p-4 bg-white">
                <div className="font-semibold">{pkg.name}</div>
                <div className="text-2xl font-bold mt-1">{pkg.price}</div>
                <div className="text-muted-foreground mt-1">{pkg.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="text-center text-xs text-muted-foreground pt-10 space-y-2">
        <div>Независим проект за сравнение на предизборни програми.</div>
        <div className="flex justify-center gap-4 flex-wrap">
          <button onClick={() => openPath("/about")} className="underline">За сайта</button>
          <button onClick={() => openPath("/privacy")} className="underline">Поверителност</button>
          <button onClick={() => openPath("/contact")} className="underline">Контакт</button>
          <button onClick={() => openPath("/advertise")} className="underline">Реклама</button>
          <button onClick={() => openPath("/methodology")} className="underline">Методология</button>
          <button onClick={() => openPath("/kak-raboti-testa")} className="underline">Как работи тестът</button>
          <button onClick={() => openPath("/analysis")} className="underline">Как сравняваме партиите</button>
          <button onClick={() => openPath("/how-to-vote")} className="underline">Как да избера партия</button>
          <button onClick={() => openPath("/terms")} className="underline">Условия</button>
          <button onClick={() => openPath("/news")} className="underline">Новини</button>
          <button onClick={() => openPath("/partii")} className="underline">Основни партии</button>
          <button onClick={() => openPath("/blog")} className="underline">Блог</button>
          <button onClick={() => openPath("/disclaimer")} className="underline">Дисклеймър</button>
        </div>
      </footer>
    </div>
  );
}
