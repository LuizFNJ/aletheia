import React from "react";
import BaseList from "../List/BaseList";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import verificationRequestApi from "../../api/verificationRequestApi";
import VerificationRequestCard from "./VerificationRequestCard";
import AletheiaButton from "../Button";

const VerificationRequestList = () => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    return (
        <Row justify="center">
            <Col span={18}>
                <BaseList
                    apiCall={verificationRequestApi.get}
                    filter={{ nameSpace }}
                    title={t(
                        "verificationRequest:verificationRequestListHeader"
                    )}
                    renderItem={({ content, data_hash }, index) => (
                        <VerificationRequestCard
                            key={index}
                            content={content}
                            expandable={false}
                            actions={[
                                <AletheiaButton
                                    href={`/verification-request/${data_hash}`}
                                >
                                    {t(
                                        "verificationRequest:openVerificationRequest"
                                    )}
                                </AletheiaButton>,
                            ]}
                        />
                    )}
                    grid={{
                        gutter: 20,
                        md: 2,
                        lg: 2,
                        xl: 2,
                        xxl: 2,
                    }}
                />
            </Col>
        </Row>
    );
};
export default VerificationRequestList;
