"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Breadcrumbs from "@/app/_components/Breadcrumbs";
import MemberModal from "@/app/_components/MemberModal";
import { Member } from "@/app/_libs/microcms";

type Props = {
  members: Member[];
};

const MembersClient = ({ members }: Props) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className={styles.container}>
      <Breadcrumbs />
      {members.length === 0 ? (
        <p className={styles.empty}>メンバーが登録されていません。</p>
      ) : (
        <ul className={styles.membersList}>
          {members.map((member) => (
            <li key={member.id} className={styles.list}>
              <Image
                src={member.image.url}
                alt={member.name}
                width={member.image.width}
                height={member.image.height}
                className={styles.image}
              />
              <dl>
                <dt className={styles.name}>{member.name}</dt>
                <dd className={styles.position}>{member.position}</dd>
                <dd className={styles.profile}>{member.profile}</dd>
                <dd className={styles.buttonContainer}>
                  <button
                    className={styles.detailButton}
                    onClick={() => openModal(member)}
                  >
                    詳細を見る
                  </button>
                </dd>
              </dl>
            </li>
          ))}
        </ul>
      )}

      <MemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default MembersClient;
