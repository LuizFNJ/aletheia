import { Row } from "antd";
import { useTranslation } from "next-i18next";
import router from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import SearchCard from "./SearchCard";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";

const OverlaySearchResults = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [nameSpace] = useAtom(currentNameSpace);
    const { results, searchName } = useAppSelector((state) => {
        return {
            results: [
                state?.search?.searchResults?.personalities || [],
                state?.search?.searchResults?.claims || [],
                state?.search?.searchResults?.sentences || [],
            ],
            searchName: state?.search?.searchInput || null,
        };
    });

    const handleSearchClick = ({
        type,
        claimSlug = "",
        personalitySlug = "",
        data_hash = "",
    }) => {
        dispatch(actions.closeResultsOverlay());
        switch (type) {
            case "personality":
                router.push(
                    nameSpace !== NameSpaceEnum.Main
                        ? `/${nameSpace}/personality/${personalitySlug}`
                        : `/personality/${personalitySlug}`
                );
                break;
            case "claim":
                router.push(
                    nameSpace !== NameSpaceEnum.Main
                        ? `/${nameSpace}/personality/${personalitySlug}/claim/${claimSlug}`
                        : `/personality/${personalitySlug}/claim/${claimSlug}`
                );
                break;
            case "sentence":
                router.push(
                    nameSpace !== NameSpaceEnum.Main
                        ? `/${nameSpace}/personality/${personalitySlug}/claim/${claimSlug}/sentence/${data_hash}`
                        : `/personality/${personalitySlug}/claim/${claimSlug}/sentence/${data_hash}`
                );
                break;
        }
    };
    return (
        <Row
            className="main-content"
            style={{
                position: "absolute",
                top: "56px",
                height: "100vh",
                width: "100vw",
                flexDirection: "column",
                background: "rgba(255,255,255,0.8)",
                zIndex: 3,
            }}
            onClick={() => {
                dispatch(actions.closeResultsOverlay());
            }}
        >
            {results.map((result, i) => {
                const type = ["personality", "claim", "sentence"][i];
                return (
                    <SearchCard
                        title={t(`search:${type}HeaderTitle`)}
                        content={result}
                        searchName={searchName}
                        handleSearchClick={handleSearchClick}
                        type={type}
                        avatar={i !== 0 ? false : true}
                    />
                );
            })}
        </Row>
    );
};

export default OverlaySearchResults;
