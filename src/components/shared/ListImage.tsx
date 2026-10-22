import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { getListImage } from "@/lib/list-images";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src: string };

export function ListImage(props: Props) {
  return <ThumbnailImage key={props.src} {...props} />;
}

function ThumbnailImage({ src, alt, loading: _loading, ...props }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [nearby, setNearby] = useState(false);
  const [failed, setFailed] = useState(false);
  const thumbnail = getListImage(src);

  useEffect(() => {
    const image = ref.current;
    if (!image) return;
    if (typeof IntersectionObserver === "undefined") {
      setNearby(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setNearby(true);
        observer.disconnect();
      }
    }, { rootMargin: "1200px 0px" });
    observer.observe(image);
    return () => observer.disconnect();
  }, []);

  return <img {...props} ref={ref} alt={alt} src={nearby ? (failed ? src : thumbnail) : undefined}
    decoding="async" loading="eager" onError={() => setFailed(true)} />;
}