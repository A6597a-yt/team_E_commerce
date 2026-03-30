package com.team_e_commerce.catalog.member.service;

import com.team_e_commerce.catalog.member.domain.Member;
import com.team_e_commerce.catalog.member.domain.MemberRole;
import com.team_e_commerce.catalog.member.repository.MemberRepository;
import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import com.team_e_commerce.common.filter.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;

    @Transactional
    public Long signUp(String email, String password, String name) {
        if (memberRepository.existsByEmail(email)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE); // 중복 이메일 예외
        }

        Member member = Member.builder()
                .email(email)
                .password(password) // 실제 운영 시 PasswordEncoder 필요
                .name(name)
                .role(MemberRole.USER)
                .build();

        return memberRepository.save(member).getId();
    }

    public String login(String email, String password) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR));

        if (!member.getPassword().equals(password)) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        }

        return jwtProvider.createToken(member.getId());
    }
}