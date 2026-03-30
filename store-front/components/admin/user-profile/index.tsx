"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

// 경로 에러를 방지하기 위해 상대 경로로 통일합니다. (폴더 구조에 따라 약간 다를 수 있습니다)
import CardBox from "../shared/CardBox";
import BreadcrumbComp from "../layout/shared/breadcrumb/BreadcrumbComp";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const UserProfile = () => {
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<"personal" | "work" | null>(null);

    // 브레드크럼(빵부스러기) 한글화 및 경로 설정
    const BCrumb = [
        { to: "/admin/settings", title: "시스템 설정" },
    ];

    // 1. 관리자 기본 인적 사항 상태
    const [personal, setPersonal] = useState({
        name: "홍길동",
        email: "admin@toyshop.com",
        phone: "010-1234-5678",
    });

    // 2. 업무 및 권한 정보 상태
    const [workInfo, setWorkInfo] = useState({
        department: "장난감 소싱팀",
        role: "최고 관리자",
        empId: "EMP-202603",
    });

    const [tempPersonal, setTempPersonal] = useState(personal);
    const [tempWorkInfo, setTempWorkInfo] = useState(workInfo);

    // 컴포넌트 마운트 시 Spring Boot 백엔드에서 내 정보 가져오기 (뼈대)
    useEffect(() => {
        const fetchMyProfile = async () => {
            try {
                const res = await fetch("/api/admin/profile");
                if (res.ok) {
                    const data = await res.json();
                    // 백엔드 데이터가 있으면 덮어씌움 (현재는 더미 데이터 유지)
                    // setPersonal({ name: data.name, email: data.email, phone: data.phone });
                    // setWorkInfo({ department: data.department, role: data.role, empId: data.empId });
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchMyProfile();
    }, []);

    // 모달이 열릴 때 원본 데이터를 임시(temp) 상태에 복사
    useEffect(() => {
        if (openModal && modalType === "personal") {
            setTempPersonal(personal);
        }
        if (openModal && modalType === "work") {
            setTempWorkInfo(workInfo);
        }
    }, [openModal, modalType, personal, workInfo]);

    // 저장 버튼 클릭 시 API로 업데이트 요청 (뼈대)
    const handleSave = async () => {
        try {
            const payload = modalType === "personal" ? tempPersonal : tempWorkInfo;

            // 서버로 데이터 전송 로직
            // await fetch("/api/admin/profile", {
            //   method: "PUT",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify(payload),
            // });

            // 화면 상태 업데이트
            if (modalType === "personal") {
                setPersonal(tempPersonal);
            } else if (modalType === "work") {
                setWorkInfo(tempWorkInfo);
            }
            setOpenModal(false);
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("정보 업데이트에 실패했습니다.");
        }
    };

    return (
        <>
            <BreadcrumbComp title="내 계정 관리" items={BCrumb} />

            <div className="flex flex-col gap-6">
                {/* 상단 프로필 요약 카드 */}
                <CardBox className="p-6 overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl relative w-full break-words">
                        <div>
                            <Image src={"/admin/images/profile/user-1.jpg"} alt="profile image" width={80} height={80} className="rounded-full" />
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center sm:justify-between items-center w-full">
                            <div className="flex flex-col sm:text-left text-center gap-1.5">
                                <h5 className="card-title text-xl font-bold">{personal.name}</h5>
                                <div className="flex flex-wrap items-center gap-1 md:gap-3">
                                    <p className="text-sm text-slate-500 font-medium">{workInfo.department}</p>
                                    <div className="hidden h-4 w-px bg-slate-300 xl:block"></div>
                                    <p className="text-sm text-slate-500 font-medium">{workInfo.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBox>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* 기본 인적 사항 박스 */}
                    <div className="space-y-6 rounded-xl border border-slate-200 md:p-6 p-4 relative w-full bg-white">
                        <h5 className="card-title text-lg font-semibold">기본 인적 사항</h5>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div><p className="text-xs text-slate-400 mb-1">이름</p><p className="font-medium text-slate-700">{personal.name}</p></div>
                            <div><p className="text-xs text-slate-400 mb-1">이메일</p><p className="font-medium text-slate-700">{personal.email}</p></div>
                            <div><p className="text-xs text-slate-400 mb-1">연락처</p><p className="font-medium text-slate-700">{personal.phone}</p></div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button onClick={() => { setModalType("personal"); setOpenModal(true); }} className="flex items-center gap-1.5 rounded-md bg-slate-800 text-white hover:bg-slate-700">
                                <Icon icon="ic:outline-edit" width="18" height="18" /> 수정
                            </Button>
                        </div>
                    </div>

                    {/* 업무 및 권한 정보 박스 */}
                    <div className="space-y-6 rounded-xl border border-slate-200 md:p-6 p-4 relative w-full bg-white">
                        <h5 className="card-title text-lg font-semibold">업무 및 권한 정보</h5>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div><p className="text-xs text-slate-400 mb-1">부서명</p><p className="font-medium text-slate-700">{workInfo.department}</p></div>
                            <div><p className="text-xs text-slate-400 mb-1">권한 등급</p><p className="font-medium text-slate-700">{workInfo.role}</p></div>
                            <div><p className="text-xs text-slate-400 mb-1">사원 번호</p><p className="font-medium text-slate-700">{workInfo.empId}</p></div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button onClick={() => { setModalType("work"); setOpenModal(true); }} className="flex items-center gap-1.5 rounded-md bg-slate-800 text-white hover:bg-slate-700">
                                <Icon icon="ic:outline-edit" width="18" height="18" /> 수정
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 수정 모달창 */}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="mb-4 text-xl">
                            {modalType === "personal" ? "기본 인적 사항 수정" : "업무 및 권한 정보 수정"}
                        </DialogTitle>
                    </DialogHeader>

                    {modalType === "personal" ? (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">이름</Label>
                                <Input
                                    id="name"
                                    placeholder="이름 입력"
                                    value={tempPersonal.name}
                                    onChange={(e) => setTempPersonal({ ...tempPersonal, name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">이메일</Label>
                                <Input
                                    id="email"
                                    placeholder="이메일 입력"
                                    value={tempPersonal.email}
                                    onChange={(e) => setTempPersonal({ ...tempPersonal, email: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2 lg:col-span-2">
                                <Label htmlFor="phone">연락처</Label>
                                <Input
                                    id="phone"
                                    placeholder="연락처 입력"
                                    value={tempPersonal.phone}
                                    onChange={(e) => setTempPersonal({ ...tempPersonal, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="department">부서명</Label>
                                <Input
                                    id="department"
                                    placeholder="부서명 입력"
                                    value={tempWorkInfo.department}
                                    onChange={(e) => setTempWorkInfo({ ...tempWorkInfo, department: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="role">권한 등급</Label>
                                <Input
                                    id="role"
                                    placeholder="권한 입력"
                                    value={tempWorkInfo.role}
                                    // 보통 권한과 사번은 관리자가 스스로 수정할 수 없게 막아둡니다. 필요시 readOnly 속성 추가 가능
                                    onChange={(e) => setTempWorkInfo({ ...tempWorkInfo, role: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2 lg:col-span-2">
                                <Label htmlFor="empId">사원 번호</Label>
                                <Input
                                    id="empId"
                                    placeholder="사원 번호 입력"
                                    value={tempWorkInfo.empId}
                                    disabled // 사번은 보통 변경 불가 처리
                                    className="bg-slate-100"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex gap-2 mt-6">
                        <Button className="rounded-md bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>
                            저장하기
                        </Button>
                        <Button variant="outline" className="rounded-md" onClick={() => setOpenModal(false)}>
                            취소
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UserProfile;