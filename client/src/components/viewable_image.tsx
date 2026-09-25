import {
  type FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  HiOutlineDownload,
} from "react-icons/hi";
import {
  IoChevronBack,
  IoChevronForward,
  IoClose,
} from "react-icons/io5";

import ActivityIndicator, {
  type ActivityIndicatorProps,
} from "@/components/activity.indicator";
import { serverURL } from "@/constants/variables/global.vars";

import styles from "./css/viewable_image.module.css";

interface ImageItem {
  uri: string;
  alt?: string | null;
  caption?: string | null;
}

interface ImageViewerProps {
  images: ImageItem[];
  initialIndex?: number;
  activityStyle?: ActivityIndicatorProps["style"];
  proxy?: boolean;
}

interface Position {
  x: number;
  y: number;
}

const CAPTION_SHORT_LENGTH = 20;
const MIN_SCALE = 0.5;
const MAX_SCALE = 5;

const ImageViewer: FC<ImageViewerProps> = ({
  images,
  initialIndex = 0,
  activityStyle = "spin",
  proxy = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex,
  );
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [displayGuide, setDisplayGuide] = useState(true);
  const [fullCaption, setFullCaption] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
  });

  const currentImage = images[currentIndex];

  const getSrc = useCallback(
    (uri: string) => {
      if (!proxy) return uri;

      return `${serverURL}/proxy-image?url=${encodeURIComponent(
        uri,
      )}`;
    },
    [proxy],
  );

  const src = currentImage
    ? getSrc(currentImage.uri)
    : "";

  const resetImage = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setIsDragging(false);
    setImageLoading(true);
    setFullCaption(false);

    dragRef.current.active = false;
  }, []);

  const openAt = useCallback(
    (index: number) => {
      if (!images.length) return;

      const safeIndex =
        ((index % images.length) + images.length) %
        images.length;

      setCurrentIndex(safeIndex);
      resetImage();
      setIsOpen(true);
    },
    [images.length, resetImage],
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    resetImage();
  }, [resetImage]);

  const handlePrevious = useCallback(() => {
    if (images.length <= 1) return;

    setCurrentIndex((current) =>
      current === 0
        ? images.length - 1
        : current - 1,
    );

    resetImage();
  }, [images.length, resetImage]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;

    setCurrentIndex((current) =>
      current === images.length - 1
        ? 0
        : current + 1,
    );

    resetImage();
  }, [images.length, resetImage]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();

      setScale((current) =>
        Math.min(
          Math.max(
            MIN_SCALE,
            current - event.deltaY * 0.001,
          ),
          MAX_SCALE,
        ),
      );
    },
    [],
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLImageElement>) => {
      if (scale <= 1) return;

      dragRef.current = {
        active: true,
        startX:
          event.clientX - translate.x,
        startY:
          event.clientY - translate.y,
      };

      setIsDragging(true);
    },
    [scale, translate],
  );

  useEffect(() => {
    if (!isOpen) return;

    const image = imgRef.current;

    image?.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    const handleMouseMove = (
      event: MouseEvent,
    ) => {
      if (!dragRef.current.active) return;

      setTranslate({
        x:
          event.clientX -
          dragRef.current.startX,
        y:
          event.clientY -
          dragRef.current.startY,
      });
    };

    const handleMouseUp = () => {
      if (!dragRef.current.active) return;

      dragRef.current.active = false;
      setIsDragging(false);
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove,
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp,
    );

    return () => {
      image?.removeEventListener(
        "wheel",
        handleWheel,
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove,
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp,
      );
    };
  }, [isOpen, handleWheel]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        handleClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        handlePrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    handleClose,
    handlePrevious,
    handleNext,
  ]);

  useEffect(() => {
    const value = localStorage.getItem(
      "show_image_viewer_guide",
    );

    setShowGuide(value !== "no");
  }, []);

  const handleDownload = useCallback(() => {
    if (!src) return;

    const link = document.createElement("a");

    link.href = src;
    link.download =
      src.split("/").pop()?.split("?")[0] ||
      "image";

    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [src]);

  const handleDontShowGuide = useCallback(() => {
    localStorage.setItem(
      "show_image_viewer_guide",
      "no",
    );

    setShowGuide(false);
  }, []);

  if (!images.length) return null;

  const caption = currentImage?.caption;

  const displayedCaption =
    caption &&
      (fullCaption ||
        caption.length <= CAPTION_SHORT_LENGTH)
      ? caption
      : caption
        ? `${caption.slice(
          0,
          CAPTION_SHORT_LENGTH,
        )}...`
        : "";

  return (
    <>
      <div
        className={styles.thumbnailOverlay}
        onClick={() => openAt(initialIndex)}
        aria-hidden="true"
      />

      {isOpen &&
        createPortal(
          <div
            className={`${styles.modal} ${isDragging
              ? styles.dragging
              : ""
              }`}
          >
            <div
              className={
                styles.modalTopbar
              }
            >
              <span
                className={
                  styles.counter
                }
              >
                {currentIndex + 1} /{" "}
                {images.length}
              </span>

              <div
                className={
                  styles.topbarActions
                }
              >
                <button
                  type="button"
                  className={
                    styles.icon
                  }
                  onClick={
                    handleDownload
                  }
                  aria-label="Download image"
                >
                  <HiOutlineDownload
                    size={28}
                  />
                </button>

                <button
                  type="button"
                  className={
                    styles.icon
                  }
                  onClick={
                    handleClose
                  }
                  aria-label="Close image"
                >
                  <IoClose
                    size={30}
                  />
                </button>
              </div>
            </div>

            {showGuide &&
              displayGuide && (
                <div
                  className={
                    styles.guideBox
                  }
                >
                  <span>
                    Scroll vertically
                    to zoom in/out,
                    and drag to
                    move the image.
                  </span>

                  <div
                    className={
                      styles.guideButtons
                    }
                  >
                    <button
                      type="button"
                      className={
                        styles.buttonClose
                      }
                      onClick={() =>
                        setDisplayGuide(
                          false,
                        )
                      }
                    >
                      Close
                    </button>

                    <button
                      type="button"
                      className={
                        styles.buttonDontShow
                      }
                      onClick={
                        handleDontShowGuide
                      }
                    >
                      Do not show
                      again
                    </button>
                  </div>
                </div>
              )}

            <div
              className={
                styles.imageContainer
              }
            >
              {imageLoading && (
                <ActivityIndicator
                  cover
                  style={
                    activityStyle
                  }
                  size="big"
                />
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.navigation} ${styles.previous}`}
                    onClick={
                      handlePrevious
                    }
                    aria-label="Previous image"
                  >
                    <IoChevronBack
                      size={32}
                    />
                  </button>

                  <button
                    type="button"
                    className={`${styles.navigation} ${styles.next}`}
                    onClick={
                      handleNext
                    }
                    aria-label="Next image"
                  >
                    <IoChevronForward
                      size={32}
                    />
                  </button>
                </>
              )}

              <img
                ref={imgRef}
                src={src}
                alt={
                  currentImage?.alt ??
                  ""
                }
                decoding="async"
                draggable={false}
                onMouseDown={
                  handleMouseDown
                }
                onLoad={() =>
                  setImageLoading(
                    false,
                  )
                }
                className={
                  styles.fullImage
                }
                style={{
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                  opacity:
                    imageLoading
                      ? 0
                      : 1,
                }}
              />
            </div>

            {caption && (
              <div
                className={
                  styles.caption
                }
              >
                {displayedCaption}

                {caption.length >
                  CAPTION_SHORT_LENGTH && (
                    <button
                      type="button"
                      className={
                        styles.toggleCaption
                      }
                      onClick={() =>
                        setFullCaption(
                          (
                            current,
                          ) =>
                            !current,
                        )
                      }
                    >
                      {fullCaption
                        ? "Show less"
                        : "Show more"}
                    </button>
                  )}
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};

export default ImageViewer;