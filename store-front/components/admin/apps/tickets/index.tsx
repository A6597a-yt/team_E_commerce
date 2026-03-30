"use client";
import React, { useEffect, useState } from "react";
import CardBox from "../../shared/CardBox";
import TicketFilter from "./TicketFilter";
import TicketListing from "./TicketListing";

// 2. 잃어버린 타입을 여기서 직접 창조하여 하위 컴포넌트들에게 빌려줍니다.
export interface TicketType {
  id: number;
  ticketTitle: string;
  ticketDescription: string;
  status: string;
  label: string;
  thumb: string;
  agentName: string;
  date: Date | string;
  deleted: boolean;
}

const TicketsApp = () => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [filter, setFilter] = useState<string>("total_tickets");
  const [ticketSearch, setTicketSearch] = useState<string>("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/admin/tickets");
        const json = await res.json();
        setTickets(json.data || []);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };
    fetchTickets();
  }, []);

  const deleteTicket = async (id: number) => {
    try {
      await fetch(`/api/admin/tickets/${id}`, {
        method: "DELETE",
      });
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting ticket:", err);
    }
  };

  const searchTickets = (text: string) => {
    setTicketSearch(text);
  };

  return (
    <CardBox>
      <TicketFilter tickets={tickets} setFilter={setFilter} />
      <TicketListing
        tickets={tickets}
        filter={filter}
        ticketSearch={ticketSearch}
        deleteTicket={deleteTicket}
        searchTickets={searchTickets}
      />
    </CardBox>
  );
};

export default TicketsApp;