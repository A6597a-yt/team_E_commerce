"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Icon } from "@iconify/react/dist/iconify.js";
import { TicketType } from "./index";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Badge } from "../../../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";

const TicketListing = ({ tickets, deleteTicket, searchTickets, ticketSearch, filter }: any) => {
  const router = useRouter();

  const getVisibleTickets = (
    tickets: TicketType[],
    filter: string,
    ticketSearch: string
  ) => {
    const searchLower = ticketSearch.toLowerCase();
    switch (filter) {
      case "total_tickets":
        return tickets?.filter(
          (c) => !c.deleted && c.ticketTitle.toLowerCase().includes(searchLower)
        );
      case "대기중":
        return tickets?.filter(
          (c) =>
            !c.deleted &&
            c.status === "대기중" &&
            c.ticketTitle.toLowerCase().includes(searchLower)
        );
      case "처리중":
        return tickets?.filter(
          (c) =>
            !c.deleted &&
            c.status === "처리중" &&
            c.ticketTitle.toLowerCase().includes(searchLower)
        );
      case "완료":
        return tickets?.filter(
          (c) =>
            !c.deleted &&
            c.status === "완료" &&
            c.ticketTitle.toLowerCase().includes(searchLower)
        );
      default:
        return tickets;
    }
  };

  const visibleTickets = getVisibleTickets(
    tickets,
    filter,
    ticketSearch
  ) || [];

  // 수정 포인트 1: Shadcn variant 대신 Tailwind 파스텔톤 클래스 반환
  const ticketBadgeClass = (ticket: TicketType) => {
    switch (ticket.status) {
      case "처리중":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-transparent";
      case "완료":
        return "bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent";
      case "대기중":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200 border-transparent";
      default:
        return "bg-gray-100 text-gray-800 border-transparent";
    }
  };

  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-4 gap-4">
        <Button
          onClick={() => router.push("/admin/tickets/create")}
          className="rounded-md whitespace-nowrap"
        >
          Create Ticket
        </Button>

        <div className="relative sm:max-w-60 max-w-full w-full">
          <Icon
            icon="tabler:search"
            height={18}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            className="pl-8"
            onChange={(e) => searchTickets(e.target.value)}
            placeholder="Search"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Ticket</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-end">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>

                <TableCell className="max-w-md">
                  <h6 className="text-base truncate">{ticket.ticketTitle}</h6>
                  <p className="text-sm text-muted-foreground truncate">
                    {ticket.ticketDescription}
                  </p>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={ticket.thumb} alt={ticket.agentName} />
                      <AvatarFallback>
                        {ticket.agentName?.charAt(0) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <h6 className="text-base">{ticket.agentName}</h6>
                  </div>
                </TableCell>

                <TableCell>
                  {/* 수정 포인트 2: variant는 에러 없는 "outline"으로 고정하고, 디자인은 className으로 덮어씌움 */}
                  <Badge variant="outline" className={`${ticketBadgeClass(ticket)} rounded-md font-medium`}>
                    {ticket.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(ticket.date), "E, MMM d")}
                  </p>
                </TableCell>

                <TableCell className="text-end">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-red-600"
                          onClick={() => deleteTicket(ticket.id)}
                        >
                          <Icon icon="tabler:trash" height="18" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Ticket</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TicketListing;