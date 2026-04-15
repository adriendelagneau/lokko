"use client";

import { CopyIcon, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  WhatsappShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  EmailShareButton,
  RedditShareButton,
  TelegramShareButton,
  PocketShareButton,
  ThreadsShareButton,
  TumblrShareButton,
  ViberShareButton,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  RedditIcon,
  TelegramIcon,
  EmailIcon,
  PocketIcon,
  ThreadsIcon,
  TumblrIcon,
  ViberIcon,
} from "react-share";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const socials = [
  { Component: TwitterShareButton, Icon: TwitterIcon, name: "Twitter" },
  { Component: WhatsappShareButton, Icon: WhatsappIcon, name: "WhatsApp" },
  { Component: LinkedinShareButton, Icon: LinkedinIcon, name: "LinkedIn" },
  { Component: RedditShareButton, Icon: RedditIcon, name: "Reddit" },
  { Component: TelegramShareButton, Icon: TelegramIcon, name: "Telegram" },
  { Component: EmailShareButton, Icon: EmailIcon, name: "Email" },
  { Component: PocketShareButton, Icon: PocketIcon, name: "Pocket" },
  { Component: ThreadsShareButton, Icon: ThreadsIcon, name: "Threads" },
  { Component: TumblrShareButton, Icon: TumblrIcon, name: "Tumblr" },
  { Component: ViberShareButton, Icon: ViberIcon, name: "Viber" },
];

export const ShareButton = ({ url }: { url: string }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy. Please copy manually.");
    }
  };

useEffect(() => {
  if (!api) return;

  // Initialize count and current only once when api is set
  setCount(api.scrollSnapList().length);
  setCurrent(api.selectedScrollSnap() + 1);

  const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
  api.on("select", onSelect);

  // cleanup function
  return () => {
    api.off("select", onSelect);
  };
}, [api]);


  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer rounded-full p-1 w-9 h-9 bg-background hover:bg-background/80 flex items-center justify-center shadow-md border border-transparent hover:border-border transition">
          <Share2 size={20}/>
        </button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle>Share this listing</DialogTitle>
          <DialogDescription className="sr-only">
            Share this listing on social media or copy the link.
          </DialogDescription>
        </DialogHeader>

        <div className="relative z-10 my-4 w-full overflow-hidden">
          {/* Left Gradient */}
          <div
            className={cn(
              "from-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-linear-to-r to-transparent",
              current === 1 && "hidden"
            )}
          />

          <Carousel
            setApi={setApi}
            opts={{ align: "start", dragFree: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-3">
              {socials.map(({ Component, Icon, name }, i) => (
                <CarouselItem
                  key={i}
                  className="mx-2 basis-auto cursor-pointer flex-col items-center pl-3"
                >
                  <Component url={url} className="flex flex-col">
                    <Icon size={48} round />
                    <span className="mt-1 text-center text-sm">{name}</span>
                  </Component>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Right Gradient */}
          <div
            className={cn(
              "from-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-linear-to-l to-transparent",
              current === count && "hidden"
            )}
          />
        </div>

        {/* Copy link */}
        <div className="bg-muted mt-4 flex items-center justify-between gap-2 overflow-hidden rounded-md px-3 py-2">
          <span className="flex-1 truncate text-sm">{url}</span>
          <Button variant="secondary" size="icon" onClick={handleCopy}>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
