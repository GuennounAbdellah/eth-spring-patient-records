import React from "react";
import PropTypes from "prop-types";
import "./PermissionList.css";

const PermissionList = ({ permissions, onRevoke }) => {
  if (!permissions || permissions.length === 0) {
    return (
      <div className="permissions-empty">
        Aucun médecin n'est actuellement autorisé à accéder à vos dossiers
      </div>
    );
  }

  // Format expiration date/time
  const formatExpiration = (expiresAt) => {
    if (!expiresAt || expiresAt === "Pas d'expiration") return "Permanent";
    
    const date = new Date(parseInt(expiresAt) * 1000);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="permissions-list">
      {permissions.map((permission) => (
        <div className="permission-item" key={permission.doctorName}>
          <div className="permission-info">
            <div className="doctor-name">{permission.doctorName}</div>
            <div className="permission-details">
              <div className="expiration">
                <span>Expiration:</span> {formatExpiration(permission.expiresAt)}
              </div>
              {permission.specialization && (
                <div className="specialization">
                  <span>Spécialité:</span> {permission.specialization}
                </div>
              )}
              {permission.hospitalAffiliation && (
                <div className="hospital">
                  <span>Hôpital:</span> {permission.hospitalAffiliation}
                </div>
              )}
            </div>
          </div>
          <div className="permission-actions">
            <button 
              onClick={() => onRevoke(permission)} 
              className="revoke-button"
            >
              Révoquer l'accès
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

PermissionList.propTypes = {
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      doctorName: PropTypes.string.isRequired,
      expiresAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      specialization: PropTypes.string,
      hospitalAffiliation: PropTypes.string,
    })
  ),
  onRevoke: PropTypes.func.isRequired
};

export default PermissionList;