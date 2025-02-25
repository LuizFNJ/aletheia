import { Col, Typography } from "antd";
import { useTranslation } from "next-i18next";
import React, { useContext } from "react";

import ReviewClassification from "../ClaimReview/ReviewClassification";
import PersonalityMinimalCard from "../Personality/PersonalityMinimalCard";
import SentenceReportCardStyle from "./SentenceReportCard.style";
import AletheiaAlert from "../AletheiaAlert";
import { useAppSelector } from "../../store/store";
import { ReviewTaskTypeEnum } from "../../machines/reviewTask/enums";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import ClaimSummaryDisplay from "./ClaimSummaryDisplay";
import SourceSummaryDisplay from "./SourceSummaryDisplay";
import VerificationRequestDisplay from "./VerificationRequestDisplay";

const { Title } = Typography;

const SentenceReportCard = ({
    target,
    personality,
    classification,
    content,
    hideDescription,
}: {
    personality?: any;
    target: any;
    content: any;
    classification?: any;
    hideDescription?: string;
}) => {
    const { t } = useTranslation();
    const { reviewTaskType } = useContext(ReviewTaskMachineContext);
    const isClaim = reviewTaskType === ReviewTaskTypeEnum.Claim;
    const {
        vw: { sm, md },
    } = useAppSelector((state) => state);
    const isSource = reviewTaskType === ReviewTaskTypeEnum.Source;
    const isVerificationRequest =
        reviewTaskType === ReviewTaskTypeEnum.VerificationRequest;

    return (
        <SentenceReportCardStyle>
            {personality && (
                <Col md={6} sm={24}>
                    <PersonalityMinimalCard personality={personality} />
                </Col>
            )}
            <Col
                lg={personality ? 18 : 24}
                md={personality ? (md && !sm ? 17 : 18) : 24}
                offset={personality && md && !sm ? 1 : 0}
                sm={24}
                className="sentence-card"
            >
                {classification && (
                    <Title className="classification" level={1}>
                        <ReviewClassification
                            // TODO: Create a more meaningful h1 for this page
                            label={t(
                                `claimReview:title${reviewTaskType}Review`
                            )}
                            classification={classification}
                        />
                    </Title>
                )}
                {isClaim && (
                    <ClaimSummaryDisplay
                        claim={target}
                        content={content?.content}
                        personality={personality}
                    />
                )}
                {isSource && <SourceSummaryDisplay href={content?.href} />}
                {isVerificationRequest && (
                    <VerificationRequestDisplay content={content} />
                )}
                {hideDescription && (
                    <AletheiaAlert
                        type="warning"
                        message={t("claim:warningTitle")}
                        description={hideDescription}
                        showIcon={true}
                        style={{ padding: "10px" }}
                    />
                )}
            </Col>
        </SentenceReportCardStyle>
    );
};

export default SentenceReportCard;
