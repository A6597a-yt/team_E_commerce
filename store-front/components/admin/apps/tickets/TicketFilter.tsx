const TicketFilter = ({ tickets, setFilter }: any) => {

  const pendingC = tickets?.filter((t: { status: string }) => t.status === "대기중").length;
  const openC = tickets?.filter((t: { status: string }) => t.status === "처리중").length;
  const closeC = tickets?.filter((t: { status: string }) => t.status === "완료").length;

  return (
    <div className="grid grid-cols-12 gap-6">
      <div
        className="lg:col-span-3 md:col-span-6 col-span-12 p-[30px] bg-lightprimary text-center rounded-md cursor-pointer"
        onClick={() => setFilter("total_tickets")}
      >
        <h3 className="text-primary text-2xl">{tickets?.length || 0}</h3>
        <h6 className="text-base text-primary">전체 티켓</h6>
      </div>
      <div
        className="lg:col-span-3 md:col-span-6 col-span-12 p-[30px] bg-lightwarning text-center rounded-md cursor-pointer"
        onClick={() => setFilter("대기중")}
      >
        <h3 className="text-warning text-2xl">{pendingC || 0}</h3>
        <h6 className="text-base text-warning">대기중</h6>
      </div>
      <div
        className="lg:col-span-3 md:col-span-6 col-span-12 p-[30px] bg-lightsuccess text-center rounded-md cursor-pointer"
        onClick={() => setFilter("처리중")}
      >
        <h3 className="text-success text-2xl">{openC || 0}</h3>
        <h6 className="text-base text-success">처리중</h6>
      </div>
      <div
        className="lg:col-span-3 md:col-span-6 col-span-12 p-[30px] bg-lighterror text-center rounded-md cursor-pointer"
        onClick={() => setFilter("완료")}
      >
        <h3 className="text-error text-2xl">{closeC || 0}</h3>
        <h6 className="text-base text-error">완료</h6>
      </div>
    </div>
  );
};

export default TicketFilter;