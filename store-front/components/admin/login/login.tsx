'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// 1. 상대 경로로 CardBox 위치를 맞춥니다. (폴더 구조에 맞게 수정 필요 시 조정)
import CardBox from '../shared/CardBox'
import { Label } from '../../ui/label'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'

export const Login = () => {
  const router = useRouter()

  // 2. 폼 상태 관리를 위한 State 설정
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 3. 폼 제출 시 실행될 실제 로그인 로직
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // 폼 기본 제출(새로고침) 방지
    setError('')
    setIsLoading(true)

    try {
      /* [Spring Boot 백엔드 API 연동 뼈대] 
       * 나중에 백엔드가 완성되면 아래 주석을 풀고 사용하세요.
       *
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.')
      }

      const data = await res.json()
      // JWT 토큰을 로컬 스토리지에 저장 (보안을 위해 HttpOnly 쿠키 사용도 권장)
      localStorage.setItem('adminToken', data.token)
      */

      // 현재는 UI 테스트를 위해 임시로 바로 넘어가도록 설정
      if (username && password) {
        router.push('/admin/dashboard')
      } else {
        setError('아이디와 비밀번호를 입력해주세요.')
      }

    } catch (err: any) {
      setError(err.message || '로그인 처리 중 서버 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className='h-screen w-full flex justify-center items-center bg-slate-50 dark:bg-slate-900'>
        <div className='md:min-w-[450px] w-[90%] min-w-max'>
          <CardBox className='p-8 shadow-lg border-none'>

            <div className='flex justify-center mb-8'>
              {/* 터지던 FullLogo 대신 깔끔한 텍스트 타이틀로 대체 */}
              <h1 className='text-2xl font-bold text-slate-800 dark:text-white'>
                장난감 쇼핑몰 관리자
              </h1>
            </div>

            {/* div 묶음이었던 것을 form 태그로 변경하여 엔터키 로그인이 가능하게 함 */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">

              <div>
                <div className='mb-2 block'>
                  <Label htmlFor='username' className='font-medium'>
                    아이디 (또는 사번)
                  </Label>
                </div>
                <Input
                  id='username'
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='아이디를 입력하세요'
                  required
                  className="bg-white"
                />
              </div>

              <div>
                <div className='mb-2 flex justify-between items-center'>
                  <Label htmlFor='password' className='font-medium'>
                    비밀번호
                  </Label>
                  <Link
                    href='#'
                    className='text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors'>
                    비밀번호 찾기
                  </Link>
                </div>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='비밀번호를 입력하세요'
                  required
                  className="bg-white"
                />
              </div>

              {/* 에러 발생 시 경고 텍스트 노출 영역 */}
              {error && (
                <p className='text-sm text-red-500 font-medium mt-1'>{error}</p>
              )}

              {/* 아이디 저장 체크박스 영역 완벽 삭제 */}

              <Button
                type='submit'
                className='w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white py-6 text-base'
                disabled={isLoading}
              >
                {isLoading ? '인증 처리 중...' : '로그인'}
              </Button>
            </form>

            {/* 하단 회원가입(Create an account) 링크 영역 완벽 삭제 */}

          </CardBox>
        </div>
      </div>
    </>
  )
}