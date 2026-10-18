import type { SVGProps } from "react";
import type { StoreIcon as StoreIconName } from "@/lib/store/settings-schema";
import {
  IconBolt,
  IconBox,
  IconCash,
  IconChat,
  IconHeart,
  IconHome,
  IconPaw,
  IconShield,
  IconStar,
  IconTruck,
} from "./icons";

const ICONS = {
  cash: IconCash,
  truck: IconTruck,
  chat: IconChat,
  shield: IconShield,
  star: IconStar,
  box: IconBox,
  heart: IconHeart,
  paw: IconPaw,
  home: IconHome,
  bolt: IconBolt,
} satisfies Record<StoreIconName, unknown>;

export function StoreIcon({ name, ...props }: { name: StoreIconName } & SVGProps<SVGSVGElement>) {
  const Icon = ICONS[name] ?? IconStar;
  return <Icon {...props} />;
}
