import React, { useEffect, useState } from "react"
import { useSearchParams, Navigate } from "react-router"
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner"
import { verifyUserApi } from "~/apis"
const AccountVerification = () => {
  // Lấy giá trị email và token từ url
  const [searchParams] = useSearchParams()
  // const email = searchParams.get('email')
  // const token = searchParams.get('token')
  const { email, token } = Object.fromEntries([...searchParams])

  // Tạo State để có biết đươc đã verify hay chưa
  const [verified, setVerified] = useState(false)

  // Gọi API để verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserApi({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])
  // Nếu url có vấn để, không tồn tài 1 trong 2 email hoặc token thì đá ra trang 404 luôn
  if (!email || !token) {
    return <Navigate to="/404" />
  }

  // Nếu chưa verify xong thì hiện loading
  if (!verified) {
    return <PageLoadingSpinner caption={"Verifying your account..."} />
  }
  // Cuối cùng nếu không gặp vấn đề gì + với verify thành công thì điều hướng về Trang Login cùng giá trị verifiedEmail
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
