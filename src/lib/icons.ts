import {
  Camera,
  Mic,
  Lightbulb,
  Video,
  Monitor,
  Headphones,
  Cable,
  Radio,
  Package,
  Star,
  ShoppingBag,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Camera,
  Mic,
  Lightbulb,
  Video,
  Monitor,
  Headphones,
  Cable,
  Radio,
  Package,
  Star,
  ShoppingBag,
  Wrench,
};

export const ICON_NAMES = Object.keys(ICONS);

export function getIcon(name: string | null | undefined): LucideIcon {
  return (name && ICONS[name]) || Package;
}
