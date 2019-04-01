import React, { Fragment } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { func } from "@xcmats/js-toolbox"
import { withStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import AboutContent from "../Welcome/AboutContent"
import TopHeadingContent from "../Welcome/TopHeadingContent"
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery"
import { appName } from "../StellarFox/env"




/**
 * Cygnus.
 *
 * Renders stand-alone Terms view.
 *
 * @module client-ui-components
 * @license Apache-2.0
 */




/**
 * `<Terms>` component.
 *
 * @function Terms
 * @returns {React.ReactElement}
 */
const Terms = ({ classes }) => {
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

                    <Typography variant="h1" noWrap>
                        <span style={{ color: "#c0c8d1", lineHeight: "3.5rem"}}>
                            Terms of Service
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
                        This website is operated by <i>{appName}</i>.
                        Throughout the site, the terms "we", "us" and "our"
                        refer to <i>{appName}</i>. We offer this website,
                        including all information, tools and services available
                        from this site to you, the user, conditioned upon your
                        acceptance of all terms, conditions, policies and
                        notices stated here.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        By visiting our site and/or creating an account,
                        you engage in our "Service" and agree to be bound by
                        the following terms and conditions ("Terms of Service",
                        "Terms"), including those additional terms and
                        conditions and policies referenced herein and/or
                        available by hyperlink. These Terms of Service apply
                        to all users of the site, including without limitation
                        users who are browsers and customers.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        Please read these Terms of Service carefully before
                        accessing or using our website. By accessing or using
                        any part of the site, you agree to be bound by
                        these Terms of Service. If you do not agree to all the
                        terms and conditions of this agreement, then you may
                        not access the website or use any services.
                        If these Terms of Service are considered an offer,
                        acceptance is expressly limited to these
                        Terms of Service.
                    </Typography>


                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        Any new features or tools which are added to the
                        current store shall also be subject to the
                        Terms of Service. You can review the most current
                        version of the Terms of Service at any time on this
                        page. We reserve the right to update, change or replace
                        any part of these Terms of Service by posting updates
                        and/or changes to our website. It is your
                        responsibility to check this page periodically for
                        changes. Your continued use of or access to the website
                        following the posting of any changes constitutes
                        acceptance of those changes.
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
                        SECTION 1 - ONLINE SERVICES TERMS
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        By agreeing to these Terms of Service, you represent
                        that you are at least the age of majority in your state
                        or province of residence, or that you are the age of
                        majority in your state or province of residence and
                        you have given us your consent to allow any of your
                        minor dependents to use this site.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        You may not use our products for any illegal or
                        unauthorized purpose nor may you, in the use of the
                        Service, violate any laws in your jurisdiction
                        (including but not limited to copyright laws).
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        A breach or violation of any of the Terms will result
                        in an immediate termination of your Services.
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
                        SECTION 2 - GENERAL CONDITIONS
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        We reserve the right to refuse service to anyone for
                        any reason at any time.
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
                        SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF
                        INFORMATION
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        We are not responsible if information made available on
                        this site is not accurate, complete or current. The
                        material on this site is provided for general
                        information only and should not be relied upon or used
                        as the sole basis for making decisions without
                        consulting primary, more accurate, more complete or
                        more timely sources of information. Any reliance on the
                        material on this site is at your own risk.
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
                        SECTION 4 - PRODUCTS AND SERVICES
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        We reserve the right, but are not obligated, to limit
                        our services to any person, geographic region or
                        jurisdiction. We may exercise this right on a
                        case-by-case basis. All descriptions of products or
                        product pricing are subject to change at anytime
                        without notice, at the sole discretion of us.
                        We reserve the right to discontinue any service at any
                        time. Any offer for any product or service made
                        on this site is void where prohibited.
                    </Typography>


                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        We do not warrant that the quality of any products,
                        services, information, or other material purchased or
                        obtained by you will meet your expectations,
                        or that any errors in the Service will be corrected
                        immediately.
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
                        SECTION 5 - OPTIONAL TOOLS
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        We may provide you with access to third-party tools
                        over which we neither monitor nor have any control
                        nor input.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        You acknowledge and agree that we provide access to
                        such tools "as is" and "as available" without any
                        warranties, representations or conditions of any
                        kind and without any endorsement. We shall have no
                        liability whatsoever arising from or relating to your
                        use of optional third-party tools.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        Any use by you of optional tools offered through the
                        site is entirely at your own risk and discretion and
                        you should ensure that you are familiar with and
                        approve of the terms on which tools are provided by the
                        relevant third-party provider(s).
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        We may also, in the future, offer new services and/or
                        features through the website (including, the release
                        of new tools and resources). Such new features and/or
                        services shall also be subject to these Terms of
                        Service.
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
                        SECTION 6 - THIRD-PARTY LINKS
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        Certain content, products and services available via
                        our Service may include materials from third-parties.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        Third-party links on this site may direct you to
                        third-party websites that are not affiliated with us.
                        We are not responsible for examining or evaluating the
                        content or accuracy and we do not warrant and will not
                        have any liability or responsibility for any
                        third-party materials or websites, or for any other
                        materials, products, or services of third-parties.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        We are not liable for any harm or damages related to
                        the use of services, resources, content, or any other
                        transactions made in connection
                        with any third-party websites. Please review carefully
                        the third-party's policies and practices and make sure
                        you understand them before you engage in any
                        transaction. Complaints, claims, concerns, or questions
                        regarding third-party products should be directed to
                        the third-party.
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
                        SECTION 7 - PERSONAL INFORMATION
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        Your submission of personal information through our
                        site is governed by our Privacy Policy. To view our
                        Privacy Policy,
                        visit <strong>
                            <a href="https://cygnus.stellarfox.net/privacy">
                                Privacy
                            </a>
                        </strong> section.
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
                        SECTION 8 - ERRORS, INACCURACIES AND OMISSIONS
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        Occasionally there may be information on our site or in
                        the Service that contains typographical errors,
                        inaccuracies or omissions that may relate to product
                        descriptions, pricing, promotions, offers and
                        availability. We reserve the right to correct any
                        errors, inaccuracies or omissions, and to change or
                        update information or cancel services if any
                        information in the Service or on any related website is
                        inaccurate at any time without prior notice
                        (including after you have created your account).
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        We undertake no obligation to update, amend or clarify
                        information in the Service or on any related website,
                        including without limitation, pricing information,
                        except as required by law. No specified update or
                        refresh date applied in the Service or on any related
                        website, should be taken to indicate that all
                        information in the Service or on any related website
                        has been modified or updated.
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
                        SECTION 9 - PROHIBITED USES
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        In addition to other prohibitions as set forth in the
                        Terms of Service, you are prohibited from using the
                        site or its content:
                            (a) for any unlawful purpose;
                            (b) to solicit others to perform or participate
                                in any unlawful acts;
                            (c) to violate any international, federal,
                                provincial or state regulations, rules, laws,
                                or local ordinances;
                            (d) to infringe upon or violate our intellectual
                                property rights or the intellectual property
                                rights of others;
                            (e) to harass, abuse, insult, harm, defame,
                                slander, disparage, intimidate, or discriminate
                                based on gender, sexual orientation, religion,
                                ethnicity, race, age, national origin, or
                                disability;
                            (f) to submit false or misleading information;
                            (g) to upload or transmit viruses or any other type
                                of malicious code that will or may be used in
                                any way that will affect the functionality
                                or operation of the Service or of any related
                                website, other websites, or the Internet;
                            (h) to collect or track the personal information of
                                others;
                            (i) to spam, phish, pharm, pretext, spider, crawl,
                                or scrape;
                            (j) for any obscene or immoral purpose; or
                            (k) to interfere with or circumvent the security
                                features of the Service or any related website,
                                other websites, or the Internet.

                        We reserve the right to terminate your use of the
                        Service or any related website for violating any of the
                        prohibited uses.
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
                        SECTION 10 - DISCLAIMER OF WARRANTIES;
                        LIMITATION OF LIABILITY
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        We do not guarantee, represent or warrant that your use
                        of our service will be uninterrupted, timely, secure or
                        error-free.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        We do not warrant that the results that may be obtained
                        from the use of the service will be accurate or
                        reliable.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        You agree that from time to time we may remove the
                        service for indefinite periods of time or cancel the
                        service at any time, without notice to you.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        You expressly agree that your use of, or inability to
                        use, the service is at your sole risk. The service
                        delivered to you is provided "as is" and "as available"
                        for your use, without any representation, warranties or
                        conditions of any kind, either express or implied,
                        including all implied warranties or conditions, title,
                        and non-infringement.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        In no case shall <i>{appName}</i>, our directors,
                        officers, employees, affiliates, agents, contractors,
                        interns, suppliers, service providers or licensors be
                        liable for any injury, loss, claim, or any direct,
                        indirect, incidental, punitive, special, or
                        consequential damages of any kind, including, without
                        limitation lost profits, lost revenue, lost savings,
                        loss of data, replacement costs, or any similar
                        damages, whether based in contract, tort
                        (including negligence), strict liability or otherwise,
                        arising from your use of any of the service or any
                        products procured using the service, or for any
                        other claim related in any way to your use of the
                        service or any product, including, but not limited to,
                        any errors or omissions in any content, or any loss or
                        damage of any kind incurred as a result of the use of
                        the service or any content (or product) posted,
                        transmitted, or otherwise made available via the
                        service, even if advised of their possibility.
                        Because some states or jurisdictions do not allow the
                        exclusion or the limitation of liability for
                        consequential or incidental damages, in such states or
                        jurisdictions, our liability shall be limited to the
                        maximum extent permitted by law.
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
                        SECTION 11 - INDEMNIFICATION
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        You agree to indemnify, defend and hold
                        harmless <i>{appName}</i> and our parent, subsidiaries,
                        affiliates, partners, officers, directors, agents,
                        contractors, licensors, service providers,
                        subcontractors, suppliers, interns and employees,
                        harmless from any claim or demand, including reasonable
                        attorneys' fees, made by any third-party due to or
                        arising out of your breach of these Terms of Service
                        or the documents they incorporate by reference,
                        or your violation of any law or the rights of a
                        third-party.
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
                        SECTION 12 - SEVERABILITY
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        In the event that any provision of these Terms of
                        Service is determined to be unlawful, void or
                        unenforceable, such provision shall nonetheless be
                        enforceable to the fullest extent permitted by
                        applicable law, and the unenforceable portion shall be
                        deemed to be severed from these Terms of Service,
                        such determination shall not affect the validity and
                        enforce-ability of any other remaining provisions.
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
                        SECTION 13 - TERMINATION
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        The obligations and liabilities of the parties incurred
                        prior to the termination date shall survive the
                        termination of this agreement for all purposes.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        These Terms of Service are effective unless and until
                        terminated by either you or us. You may terminate these
                        Terms of Service at any time by notifying us that you
                        no longer wish to use our Services, or when you cease
                        using our site.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        If in our sole judgment you fail, or we suspect that
                        you have failed, to comply with any term or provision
                        of these Terms of Service, we also may terminate this
                        agreement at any time without notice and you will
                        remain liable for all amounts due up to and including
                        the date of termination; and/or accordingly may deny
                        you access to our Services (or any part thereof).
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
                        SECTION 14 - ENTIRE AGREEMENT
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        The failure of us to exercise or enforce any right or
                        provision of these Terms of Service shall not
                        constitute a waiver of such right or provision.
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        These Terms of Service and any policies or operating
                        rules posted by us on this site or in respect to The
                        Service constitutes the entire agreement and
                        understanding between you and us and govern your use of
                        the Service, superseding any prior or contemporaneous
                        agreements, communications and proposals, whether
                        oral or written, between you and us (including, but not
                        limited to, any prior versions of the Terms of Service).
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        Any ambiguities in the interpretation of these Terms
                        of Service shall not be construed against the drafting
                        party.
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
                        SECTION 15 - GOVERNING LAW
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        These Terms of Service and any separate agreements
                        whereby we provide you Services shall be governed by
                        and construed in accordance with the laws of Germany.
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
                        SECTION 16 - CHANGES TO TERMS OF SERVICE
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        You can review the most current version of the Terms of
                        Service at any time at this page.

                        We reserve the right, at our sole discretion, to
                        update, change or replace any part of these Terms of
                        Service by posting updates and changes to our website.
                        It is your responsibility to check our website
                        periodically for changes.
                        Your continued use of or access to our website or the
                        Service following the posting of any changes to these
                        Terms of Service constitutes acceptance of those
                        changes.
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
                        SECTION 17 - CONTACT INFORMATION
                    </Typography>

                    <Typography
                        variant="body1"
                        style={{
                            marginTop:  "1rem",
                            color: "#c0c8d1",
                            lineHeight: "2rem",
                        }}
                    >
                        Questions about the Terms of Service should be sent to
                        us at <a href="mailto:contact@stellarfox.net?subject=[TOS]">
                        contact@stellarfox.net</a>
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
)(Terms)
