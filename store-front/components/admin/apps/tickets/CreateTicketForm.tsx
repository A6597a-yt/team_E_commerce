"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { isValid, format } from "date-fns";
// 1. index.tsx에서 직접 만든 타입을 불러옵니다.
import { TicketType } from "./index";
// 2. CardBox 경로를 상대 경로로 수정합니다.
import CardBox from "../../shared/CardBox";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Button } from "../../../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../../../ui/avatar";
import { ChevronDown } from "lucide-react";

const agents = [
  { id: 1, name: "Liam", photo: "/images/profile/user-10.jpg" },
  { id: 2, name: "Steve", photo: "/images/profile/user-2.jpg" },
  { id: 3, name: "Jack", photo: "/images/profile/user-3.jpg" },
  { id: 4, name: "John", photo: "/images/profile/user-8.jpg" },
];

const CreateTicketForm = () => {
  const [ticketDate, setTicketDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [agentPhoto, setAgentPhoto] = useState(agents[0].photo);

  const router = useRouter();

  const handleSubmit = async () => {
    if (!ticketTitle || !ticketDescription) {
      alert("Please fill out all fields.");
      return;
    }

    const newTicket = {
      ticketTitle,
      ticketDescription,
      status: "대기중",
      label: "primary",
      thumb: agentPhoto,
      agentName: selectedAgent.name,
      date: new Date(ticketDate),
      deleted: false,
    };

    try {
      await fetch("/api/admin/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });

      resetForm();
      router.push("/admin/tickets");
    } catch (error) {
      console.error("Failed to create ticket", error);
    }
  };

  const resetForm = () => {
    setTicketDate(new Date().toISOString().split("T")[0]);
    setTicketTitle("");
    setTicketDescription("");
    setSelectedAgent(agents[0]);
    setAgentPhoto(agents[0].photo);
  };

  const parsedDate = isValid(new Date(ticketDate))
    ? new Date(ticketDate)
    : new Date();
  const formattedOrderDate = format(parsedDate, "EEEE, MMMM dd, yyyy");

  return (
    <CardBox>
      <h2 className="text-lg font-semibold mb-4">새 티켓 생성</h2>
      <p>Date : {formattedOrderDate}</p>

      <div className="bg-lightgray dark:bg-gray-800/70 p-6 my-6 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="ticketTitle" className="mb-2 block">
              Ticket Title
            </Label>
            <Input
              id="ticketTitle"
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
              placeholder="Ticket Title"
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="ticketDescription" className="mb-2 block">
              Ticket Description
            </Label>
            <Input
              id="ticketDescription"
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              placeholder="Ticket Description"
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between mt-6 gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">{selectedAgent.name}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-md">
              {agents.map((agent) => (
                <DropdownMenuItem
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgent(agent);
                    setAgentPhoto(agent.photo);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={agent.photo} alt={agent.name} width={40} height={40} />
                      <AvatarFallback>{agent.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{agent.name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex gap-3">
            <Button onClick={handleSubmit} className="rounded-md">
              Save
            </Button>
            <Button
              variant="destructive"
              className="rounded-md"
              onClick={() => router.push("/admin/tickets")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </CardBox>
  );
};

export default CreateTicketForm;