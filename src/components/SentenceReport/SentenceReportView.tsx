import { useSelector } from "@xstate/react";
import { Col, Row } from "antd";
import React, { useContext } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { Roles } from "../../types/enums";
import {
    reviewingSelector,
    publishedSelector,
    crossCheckingSelector,
    reportSelector,
} from "../../machines/reviewTask/selectors";
import colors from "../../styles/colors";
import CTARegistration from "../Home/CTARegistration";
import SentenceReportContent from "./SentenceReportContent";
import { useAtom } from "jotai";
import { currentUserRole, isUserLoggedIn } from "../../atoms/currentUser";
import SentenceReportComments from "./SentenceReportComments";
import { ReviewTaskTypeEnum } from "../../../server/types/enums";

const SentenceReportView = ({
    context,
    userIsNotRegular,
    userIsReviewer,
    isHidden,
    userIsAssignee,
    userIsCrossChecker,
    href,
    componentStyle,
}) => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [role] = useAtom(currentUserRole);
    const { machineService, publishedReview, reviewTaskType } = useContext(
        ReviewTaskMachineContext
    );
    const isReport = useSelector(machineService, reportSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;
    const userIsAdmin = role === Roles.Admin || role === Roles.SuperAdmin;

    const canShowClassificationAndCrossChecking =
        (isCrossChecking && (userIsAdmin || userIsCrossChecker)) ||
        (isReviewing && (userIsAdmin || userIsReviewer)) ||
        (isReport && (userIsAdmin || userIsAssignee || userIsCrossChecker));

    const canShowReport =
        (isPublished && (!isHidden || userIsNotRegular)) ||
        canShowClassificationAndCrossChecking;

    return (
        canShowReport &&
        reviewTaskType !== ReviewTaskTypeEnum.VerificationRequest && (
            <Row
                style={
                    (isCrossChecking || isReport || isReviewing) && {
                        backgroundColor: colors.lightGray,
                    }
                }
            >
                <Col span={componentStyle.span} offset={componentStyle.offset}>
                    {canShowClassificationAndCrossChecking && (
                        <SentenceReportComments context={context} />
                    )}
                    <SentenceReportContent
                        context={context?.reviewDataHtml || context}
                        classification={context.classification}
                        showClassification={
                            canShowClassificationAndCrossChecking
                        }
                        href={href}
                    />
                    {!isLoggedIn && <CTARegistration />}
                </Col>
            </Row>
        )
    );
};

export default SentenceReportView;
