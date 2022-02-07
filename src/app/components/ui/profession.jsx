import { getProfessionsId, getProfessionsLoadingStatus } from "../../store/professions";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import React from "react";

const Profession = ({ id }) => {
    const professionsLoading = useSelector(getProfessionsLoadingStatus());
    const prof = useSelector(getProfessionsId(id));
    if (!professionsLoading) {
        return <p>{prof.name}</p>;
    } else return "loading ...";
};
Profession.propTypes = {
    id: PropTypes.string
};
export default Profession;
