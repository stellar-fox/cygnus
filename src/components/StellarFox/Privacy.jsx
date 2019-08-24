import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import AboutContent from "../Welcome/AboutContent"
import TopHeadingContent from "../Welcome/TopHeadingContent"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import {
    appCodeName,
    appName,
} from "../StellarFox/env"




/**
 * Cygnus.
 *
 * Renders stand-alone Privacy view.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<Privacy>` component.
 *
 * @function Privacy
 * @returns {React.ReactElement}
 */
const Privacy = ({ classes }) => {
    const isMobile = useMediaQuery("(max-width:960px)")

    return <Fragment>
        <div className={classes.bg}>
            <TopHeadingContent />
        </div>
        <div className={isMobile ?
            `flex-box-col content-centered items-centered ${classes.bgDark}` :
            `flex-box-row space-around ${classes.bgDark}`}
        >
            <div className={isMobile ? "flex-box-col" : "flex-box-row"}>
                <div className={isMobile ? "hero-mobile" : "hero-large"}>

                    <Typography variant={isMobile ? "h3" : "h1"} noWrap>
                        <span
                            style={{
                                color: "#c0c8d1",
                                lineHeight: isMobile ? "0.5rem" : "3rem",
                            }}
                        >
                            Privacy Statement
                        </span>
                    </Typography>
                    <Typography variant="body2" color="secondary">
                        Legal
                    </Typography>






                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "3rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        By accessing and using this website, you are indicating
                        your consent to the privacy practices described in this
                        Policy. If you do not accept these, you must not access
                        or use the Website. <i>{appName}</i> reserves the
                        right to change this Policy at any time. Use of the
                        website / software after such changes are posted will
                        signify your acceptance of this new policy. You should
                        visit this page periodically to review this policy.
                    </Typography>


                    <Typography
                        style={{
                            marginTop:  "3rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                            fontWeight: 600,
                        }}
                        variant="subtitle1"
                    >
                        SECTION 1 - WHAT DO WE DO WITH YOUR INFORMATION?
                    </Typography>


                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        When you sign up for a payment address and Stellar
                        network account, we collect the personal information
                        you give us such as your, email address.

                        When you use our service, we also automatically receive
                        your computer’s internet protocol (IP) address in order
                        to provide us with information that helps us learn
                        about your browser and operating system.

                        Email marketing: With your permission, we may send you
                        emails in the future about our services, new products
                        and other updates.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        <i>{appName}</i> respects your privacy and is committed
                        to protect the information you provide us through this
                        website. We do not sell or distribute user information
                        to third parties unless it is legally required.
                    </Typography>



                    <Typography
                        style={{
                            marginTop:  "3rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                            fontWeight: 600,
                        }}
                        variant="subtitle1"
                    >
                        SECTION 2 - DATA SECURITY COMPLIANCE
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        The security and privacy of your data is a crucial part
                        of <i>{appName}</i> business. We are committed to
                        your online privacy and recognize your need for
                        appropriate protection and management of any personally
                        identifiable information (“Personal Information”) that
                        you share with us. <i>{appName}</i> focuses on
                        continuous improvement of its privacy policy.
                        <i>{appName}</i> uses commercially reasonable efforts
                        to protect your personal information, including
                        safeguards such as firewalls, password-protected
                        databases with limited physical or electronic access,
                        and encryption. In addition, Lobstr.co utilizes secure
                        technology such as SSL to transfer information provided
                        by users, and additional measures in the processing of
                        sensitive information. While we have taken efforts to
                        guard your personal information, we cannot guarantee
                        that your information may not be disclosed or accessed
                        by accidental circumstances or by the unauthorized acts
                        of others.
                    </Typography>


                    <Typography
                        style={{
                            marginTop:  "3rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                            fontWeight: 600,
                        }}
                        variant="subtitle1"
                    >
                        SECTION 3 - COLLECTING OF PERSONAL INFORMATION
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        <i>{appName}</i> collects information about our web
                        visitors indirectly through our Internet access logs.
                        When you access <i>{appCodeName}</i>, the
                        IP address is automatically collected and placed in our
                        Internet access logs. We use this information to learn
                        about which sections, pages and information is being
                        accessed.
                    </Typography>


                    <Typography
                        style={{
                            marginTop:  "3rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                            fontWeight: 600,
                        }}
                        variant="subtitle1"
                    >
                        SECTION 4 - USAGE OF PERSONAL INFORMATION
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        Personal Information means any information that may be
                        used to identify an individual, including, but not
                        limited to, a first and last name, a home or other
                        physical address and an email address or other contact
                        information, whether at work or at home. In general,
                        you can visit <i>{appName}</i> Web pages without
                        telling us who you are or revealing any Personal
                        Information about yourself. If you choose to provide
                        your Personal Information in your user account, we may
                        transfer that information within <i>{appCodeName}</i>
                        or to <i>{appCodeName}</i> third-party service
                        providers or partners or affiliates, across borders,
                        and from your country or jurisdiction to other
                        countries or jurisdictions around the world.
                        <i>{appCodeName}</i> strives to comply with all
                        applicable laws to protect your privacy.
                        Although legal requirements may vary from country to
                        country, <i>{appCodeName}</i> intends to adhere to the
                        principles set forth in this Online Privacy Policy even
                        if, in connection with the above, we transfer your
                        Personal Information from your country to countries
                        that may not require an “adequate” level of protection
                        for your Personal Information. In other words, our goal
                        is to provide protection for your Personal Information
                        no matter where that Personal Information is collected,
                        transferred, or retained.
                    </Typography>


                    <Typography
                        style={{
                            marginTop:  "3rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                            fontWeight: 600,
                        }}
                        variant="subtitle1"
                    >
                        SECTION 5 - DISCLOSURE OF PERSONAL INFORMATION
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        <i>{appName}</i> does not rent, sell, or share personal
                        information about you with non-affiliated party or
                        companies. If you have submitted user information to us
                        through an e-mail or through web
                        forms, <i>{appName}</i> maintains your security by
                        ensuring that the information is only distributed
                        within <i>{appName}</i> and associated
                        websites, <i>{appName}</i> affiliates and partners,
                        who are all responsible for responding to your requests
                        either directly or indirectly. We may disclose
                        information to trusted partners who work on behalf of
                        or with <i>{appName}</i> under extremely strict
                        confidentiality agreements. We may also disclose
                        information when it is necessary to share information
                        in order to investigate, prevent, or take action
                        regarding illegal activities, suspected fraud,
                        situations involving potential threats to the physical
                        safety of any person, or as otherwise required by law.
                    </Typography>


                    <Typography
                        style={{
                            marginTop:  "3rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                            fontWeight: 600,
                        }}
                        variant="subtitle1"
                    >
                        SECTION 7 - QUESTIONS AND CONTACT INFORMATION
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        If you would like to: access, correct, amend or delete
                        any personal information we have about you, register a
                        complaint, or simply want more information contact us
                        at <a href="mailto:contact@stellarfox.net?subject=[PRIVACY]">
                        contact@stellarfox.net
                        </a>
                    </Typography>




                </div>
            </div>
        </div>


        <AboutContent />
    </Fragment>
}




// ...
export default func.compose(
    withStyles((theme) => ({
        bg: {
            backgroundColor: theme.palette.primary.light,
        },
        bgDark: {
            backgroundColor: theme.palette.primary.main,
        },
        bgLight: {
            backgroundColor: theme.palette.secondary.light,
        },
    })),
    connect(
        (_state) => ({}),
        (dispatch) => bindActionCreators({}, dispatch),
    ),
)(Privacy)
