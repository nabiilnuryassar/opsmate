import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { OnboardingPage } from '@/features/business/pages/OnboardingPage'
import { BusinessProfilePage } from '@/features/settings/pages/BusinessProfilePage'
import { CustomerListPage } from '@/features/customers/pages/CustomerListPage'
import { CustomerFormPage } from '@/features/customers/pages/CustomerFormPage'
import { CustomerDetailPage } from '@/features/customers/pages/CustomerDetailPage'
import { ProductListPage } from '@/features/products/pages/ProductListPage'
import { ProductFormPage } from '@/features/products/pages/ProductFormPage'
import { ProductDetailPage } from '@/features/products/pages/ProductDetailPage'
import { OrderListPage } from '@/features/orders/pages/OrderListPage'
import { OrderFormPage } from '@/features/orders/pages/OrderFormPage'
import { OrderDetailPage } from '@/features/orders/pages/OrderDetailPage'
import { InvoiceListPage } from '@/features/invoices/pages/InvoiceListPage'
import { InvoiceDetailPage } from '@/features/invoices/pages/InvoiceDetailPage'
import { ReminderListPage } from '@/features/reminders/pages/ReminderListPage'
import { DailyReportPage } from '@/features/reports/pages/DailyReportPage'
import { AIAssistantPage } from '@/features/ai/pages/AIAssistantPage'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/settings/business" element={<BusinessProfilePage />} />
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/customers/new" element={<CustomerFormPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/new" element={<ProductFormPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/products/:id/edit" element={<ProductFormPage />} />
        <Route path="/orders" element={<OrderListPage />} />
        <Route path="/orders/new" element={<OrderFormPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/orders/:id/edit" element={<OrderFormPage />} />
        <Route path="/invoices" element={<InvoiceListPage />} />
        <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
        <Route path="/reminders" element={<ReminderListPage />} />
        <Route path="/reports" element={<DailyReportPage />} />
        <Route path="/reports/daily" element={<DailyReportPage />} />
        <Route path="/ai" element={<AIAssistantPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
