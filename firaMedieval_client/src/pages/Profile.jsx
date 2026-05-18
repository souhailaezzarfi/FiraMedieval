import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import reservaService from "../services/reservaAutocaravanaService";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    cognoms: "",
    telefon: "",
    email: "",
  });
  const [saved, setSaved] = useState(false);

  const [reserva, setReserva] = useState(null);
  const [loadingReserva, setLoadingReserva] = useState(true);
  const [cancelant, setCancelant] = useState(false);

  // NOU: modal d'edició de reserva
  const [showEditReserva, setShowEditReserva] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [savingReserva, setSavingReserva] = useState(false);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || "",
        cognoms: user.cognoms || "",
        telefon: user.telefon || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.role === "admin") return;
    setLoadingReserva(true);
    reservaService
      .getAll()
      .then((res) => {
        const reserves = res.data ?? [];
        const activa = reserves.find((r) => r.estat !== "cancel·lada");
        setReserva(activa ?? null);
      })
      .catch(() => setReserva(null))
      .finally(() => setLoadingReserva(false));
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await userService.updateProfile(user.id, formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Estàs segur que vols eliminar el teu compte? Aquesta acció no es pot desfer.",
    );
    if (!confirmDelete) return false;
    try {
      await userService.deleteProfile(user.id);
      return true;
    } catch (err) {
      alert("No s'ha pogut eliminar el compte.");
      return false;
    }
  };

  const handleCancelReserva = async () => {
    if (!window.confirm("Segur que vols cancel·lar la teva reserva?")) return;
    setCancelant(true);
    try {
      await reservaService.delete(reserva.id);
      setReserva(null);
    } catch (err) {
      alert(err.response?.data?.message ?? "Error en cancel·lar la reserva.");
    } finally {
      setCancelant(false);
    }
  };

  // NOU: obrir modal d'edició
  const openEditReserva = () => {
    setEditForm({
      marca_vehicle: reserva.marca_vehicle,
      model_vehicle: reserva.model_vehicle,
      matricula: reserva.matricula,
      procedencia: reserva.procedencia,
      total_persones: reserva.total_persones,
      data_arribada: reserva.data_arribada,
      data_sortida: reserva.data_sortida,
    });
    setEditError(null);
    setShowEditReserva(true);
  };

  // NOU: desar canvis de la reserva
  const handleSaveReserva = async () => {
    setEditError(null);

    if (new Date(editForm.data_sortida) <= new Date(editForm.data_arribada)) {
      setEditError("La data de sortida ha de ser posterior a la d'arribada.");
      return;
    }

    setSavingReserva(true);
    try {
      const res = await reservaService.update(reserva.id, editForm);
      setReserva(res.data);
      setShowEditReserva(false);
    } catch (err) {
      setEditError(err.response?.data?.message ?? "Error en desar els canvis.");
    } finally {
      setSavingReserva(false);
    }
  };

  const estatBadge = (estat) => {
    if (estat === "confirmada")
      return (
        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
          Confirmada
        </span>
      );
    if (estat === "espera")
      return (
        <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
          En espera
        </span>
      );
    return (
      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
        Cancel·lada
      </span>
    );
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("ca-ES") : "—");

  const initials = user
    ? `${user.nom?.charAt(0) || ""}${user.cognoms?.charAt(0) || ""}`
    : "?";

  return (
    <div
      className="min-h-screen bg-[#f7f2e8]"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      <div
        className="relative h-48 flex items-end"
        style={{
          background:
            "linear-gradient(135deg, #ba5940 0%, #8b4513 40%, #d7b731 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)`,
            backgroundSize: "20px 20px",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 pb-0 w-full flex items-end gap-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl border-4 border-white translate-y-12 shrink-0"
            style={{ background: "#432918", color: "#d7b731" }}
          >
            {initials}
          </div>
          <div className="pb-4 text-white">
            <p className="text-xs uppercase tracking-widest opacity-70 mb-1">
              Perfil d'usuari
            </p>
            <h1 className="text-2xl font-bold">
              {user?.nom} {user?.cognoms}
            </h1>
            <p className="text-sm opacity-75">{user?.email}</p>
          </div>
        </div>
        <IoArrowBack
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-3xl text-white cursor-pointer"
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8d9b5] overflow-hidden">
          <div className="px-8 py-5 border-b border-[#e8d9b5] flex items-center gap-3">
            <span className="material-symbols-outlined text-[#d7b731]">
              person
            </span>
            <h2 className="text-lg font-bold text-[#432918]">
              Dades personals
            </h2>
          </div>

          <form onSubmit={handleUpdate} className="p-8">
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { label: "Nom", key: "nom", type: "text" },
                { label: "Cognoms", key: "cognoms", type: "text" },
                { label: "Telèfon", key: "telefon", type: "tel" },
                { label: "Email", key: "email", type: "email" },
              ].map(({ label, key, type }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#8b6a4a]">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={formData[key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                    className="border border-[#e8d9b5] rounded-lg px-4 py-3 bg-[#faf7f2] text-[#432918] focus:outline-none focus:border-[#d7b731] transition-colors"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="submit"
                className="bg-[#432918] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d7b731] transition-colors hover:scale-105 transform"
              >
                Desar canvis
              </button>
              {saved && (
                <span className="text-sm text-green-600 font-medium">
                  Canvis desats correctament
                </span>
              )}
            </div>
          </form>
        </div>

        {user?.role !== "admin" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* RESERVES */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8d9b5] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#e8d9b5] flex items-center gap-3">
                <span className="material-symbols-outlined text-[#d7b731]">
                  local_parking
                </span>
                <h3 className="text-lg font-bold text-[#432918]">
                  Les meves reserves
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {loadingReserva ? (
                  <p className="text-sm text-[#8b6a4a] text-center">
                    Carregant...
                  </p>
                ) : reserva ? (
                  <>
                    <div className="flex items-start gap-4 p-4 bg-[#faf7f2] rounded-xl border-l-4 border-[#d7b731]">
                      <div className="flex-1">
                        <p className="font-semibold text-[#432918]">
                          {reserva.marca_vehicle} {reserva.model_vehicle}
                        </p>
                        <p className="text-sm text-[#8b6a4a] mt-0.5">
                          Matrícula: {reserva.matricula}
                        </p>
                        <p className="text-sm text-[#8b6a4a]">
                          Arribada: {formatDate(reserva.data_arribada)}
                        </p>
                        <p className="text-sm text-[#8b6a4a]">
                          Sortida: {formatDate(reserva.data_sortida)}
                        </p>
                      </div>
                      {estatBadge(reserva.estat)}
                    </div>
                    {/* editar */}
                    <button
                      onClick={openEditReserva}
                      className="w-full text-sm text-[#432918] border border-[#e8d9b5] rounded-lg py-2 hover:bg-[#faf7f2] transition-colors"
                    >
                      Editar reserva
                    </button>
                    <button
                      onClick={handleCancelReserva}
                      disabled={cancelant}
                      className="w-full text-sm text-red-600 border border-red-300 rounded-lg py-2 hover:bg-red-50 transition-colors disabled:opacity-60"
                    >
                      {cancelant ? "Cancel·lant..." : "Cancel·lar reserva"}
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-[#8b6a4a] text-center pt-2">
                    No tens cap reserva activa
                  </p>
                )}
              </div>
            </div>

            {/* INSCRIPCIONS */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8d9b5] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#e8d9b5] flex items-center gap-3">
                <span className="material-symbols-outlined text-[#d7b731]">
                  event_available
                </span>
                <h3 className="text-lg font-bold text-[#432918]">
                  Les meves inscripcions
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-start gap-4 p-4 bg-[#faf7f2] rounded-xl border-l-4 border-[#432918]">
                  <div className="flex-1">
                    <p className="font-semibold text-[#432918]">
                      Taller Medieval
                    </p>
                    <p className="text-sm text-[#8b6a4a] mt-0.5">
                      Divendres 3 d'abril
                    </p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                    En espera
                  </span>
                </div>

                <p className="text-sm text-[#8b6a4a] text-center pt-2">
                  No tens més inscripcions
                </p>
              </div>
            </div>
          </div>
        )}

        {user?.role !== "admin" && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
            <div className="p-8 flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#432918]">Eliminar compte</p>
                <p className="text-sm text-[#8b6a4a]">
                  Aquesta acció és irreversible
                </p>
              </div>
              <button
                onClick={async () => {
                  await handleDelete();
                  logout();
                  navigate("/");
                }}
                className="border-2 border-red-400 text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-colors"
              >
                Eliminar compte
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL EDICIÓ RESERVA */}
      {showEditReserva && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-[#faf7f2] rounded-2xl w-full max-w-lg border border-[#e8d9b5] max-h-[90vh] overflow-y-auto"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            <div className="px-8 py-6 border-b border-[#e8d9b5]">
              <h2 className="text-xl font-bold text-[#432918]">
                Editar reserva
              </h2>
            </div>

            <div className="px-8 py-6 space-y-4">
              {editError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
                  {editError}
                </div>
              )}

              {[
                { key: "marca_vehicle", label: "Marca", type: "text" },
                { key: "model_vehicle", label: "Model", type: "text" },
                { key: "matricula", label: "Matrícula", type: "text" },
                { key: "procedencia", label: "Procedència", type: "text" },
                {
                  key: "total_persones",
                  label: "Total persones",
                  type: "number",
                },
                {
                  key: "data_arribada",
                  label: "Data d'arribada",
                  type: "date",
                },
                { key: "data_sortida", label: "Data de sortida", type: "date" },
              ].map(({ key, label, type }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#8b6a4a]">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={editForm[key] ?? ""}
                    min={type === "number" ? 1 : undefined}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="border border-[#e8d9b5] rounded-lg px-4 py-3 bg-white text-[#432918] focus:outline-none focus:border-[#d7b731] transition-colors"
                  />
                </div>
              ))}
            </div>

            <div className="px-8 py-4 border-t border-[#e8d9b5] flex justify-end gap-3">
              <button
                onClick={() => setShowEditReserva(false)}
                className="border border-[#e8d9b5] text-[#8b6a4a] px-5 py-2 rounded-full hover:bg-[#f0e9d8] transition-colors"
              >
                Cancel·lar
              </button>
              <button
                onClick={handleSaveReserva}
                disabled={savingReserva}
                className="bg-[#432918] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#d7b731] transition-colors disabled:opacity-60"
              >
                {savingReserva ? "Desant..." : "Desar canvis"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
