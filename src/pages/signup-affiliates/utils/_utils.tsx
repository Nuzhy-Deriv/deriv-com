import { Analytics, TEvents } from '@deriv/analytics'
import { SubmitTypes } from '../_types'

export const customSlugify = (text: string): string => {
    const charMap: { [key: string]: string } = {
        ə: 'e',
        '(': ' ',
        ')': ' ',
        // Add other special characters and their mappings here if needed
    }
    return text
        .toString()
        .split('')
        .map((char) => charMap[char] || char)
        .join('')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/'/g, '')
        .replace(/--+/g, '-')
}
export const Submit = ({
    is_online,
    affiliate_account,
    setSignupStatus,
    affiliateSend,
}: SubmitTypes) => {
    if (!is_online) {
        setSignupStatus('lost connection')
        Analytics?.trackEvent('ce_partner_account_signup_form', {
            action: 'partners_signup_error',
            partner_signup_error_message: 'lost connection',
            form_name: 'ce_partner_account_signup_form',
        })
    } else
        affiliateSend({
            email: affiliate_account.email,
            type_of_account: affiliate_account.account_type,
            commission_plan: affiliate_account.account_plan,
            country: affiliate_account.account_address.country.symbol,
            address_city: affiliate_account.account_address.city,
            address_postcode: affiliate_account.account_address.postal_code,
            address_state: customSlugify(affiliate_account.account_address.state.name),
            address_street: affiliate_account.account_address.street,
            first_name: affiliate_account.account_details.first_name,
            last_name: affiliate_account.account_details.last_name,
            date_of_birth: affiliate_account.account_details.date_birth?.toISOString().slice(0, 10),
            over_18_declaration: 1,
            website_url: affiliate_account.account_details?.website_url.includes('www.')
                ? affiliate_account.account_details?.website_url
                : `www.${affiliate_account.account_details?.website_url}`,
            user_name: affiliate_account.account_details.username,
            password: affiliate_account.account_details.password,
            phone: affiliate_account.account_details.phone,
            phone_code: Number(affiliate_account.account_details.phone.substring(1, 4)),
            whatsapp_number: affiliate_account.account_details.phone,
            whatsapp_number_phoneCode: Number(
                affiliate_account.account_details.phone.substring(1, 4),
            ),
            non_pep_declaration: affiliate_account.terms_of_use.non_pep_declaration_accepted && 1,
            tnc_accepted: affiliate_account.terms_of_use.tnc_accepted && 1,
            tnc_affiliate_accepted: affiliate_account.terms_of_use.tnc_affiliate_accepted && 1,
            ...(affiliate_account.account_details?.company_name !== '' && {
                company_name: affiliate_account.account_details?.company_name,
            }),
            ...(affiliate_account.account_details?.company_registration_number !== '' && {
                company_registration_number:
                    affiliate_account.account_details?.company_registration_number,
            }),
        })
}

export const trackEvent = ({
    action,
    email,
    partner_signup_error_message,
    user_choice,
    success_source,
    step_num,
    step_codename,
}: TEvents['ce_partner_account_signup_form']) => {
    Analytics?.trackEvent('ce_partner_account_signup_form', {
        action,
        form_name: 'ce_partner_account_signup_form',
        ...(email && { email }),
        ...(user_choice && { user_choice }),
        ...(success_source && { success_source }),
        ...(step_num && { step_num }),
        ...(step_codename && { step_codename }),
        ...(partner_signup_error_message && { partner_signup_error_message }),
    })
}
