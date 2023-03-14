import React from 'react'
import DepartmentPage from '../_dept-layout-components/_department-page'
import career_data from '../data/_career-data'
import { SEO } from 'components/containers'
import { WithIntl } from 'components/localization'

const Career2 = () => {
    return (
        <>
            <SEO
                title="_t_Deriv Careers | Legal and Compliance jobs_t_"
                description="_t_See job vacancies in Deriv’s Legal and Compliance team. Join and grow with us._t_"
            />
            <DepartmentPage data={career_data.compliance[0]} />
        </>
    )
}

export default WithIntl()(Career2)
