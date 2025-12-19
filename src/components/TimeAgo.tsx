"use client";
import { format } from "timeago.js";

export function ListingTimeAgo({ date }: { date: string | Date }) {
  return <span>{format(new Date(date))}</span>;
}
