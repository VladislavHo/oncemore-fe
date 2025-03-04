import vk from "../images/VK.svg";
import tg from "../images/Telegram.svg";
import whatsapp from "../images/WhatsApp.svg";
import yt from "../images/YouTube.svg";

const userLinks = [
  {
    name: "Профиль",
    link: "/me",
  },
  {
    name: "Заказы",
    link: "/orders",
  },
  {
    name: "Админка",
    link: "/admin",
  },
  {
    name: "Выход",
    link: "/logout",
  },
];

const contacts = [
  {
    icon: vk,
    link: "https://vk.com/omcos"
  },
  {
    icon: tg,
    link: "https://t.me/OMCOS"
  },
  {
    icon: whatsapp,
    link: "https://api.whatsapp.com/send?phone=79055032444"
  },
  {
    icon: yt,
    link: "http://www.youtube.com/@ONCEMORE_BEAUTY"
  },
]

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.oncemorecosmetics.ru"
    : "http://localhost:3030";
// const baseUrl = "https://api.oncemorecosmetics.ru"
export {
  contacts,
  userLinks,
  baseUrl,
};