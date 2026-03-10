import { View, Text, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { AlertTriangle, CheckCircle, XCircle, Info, X } from "lucide-react-native";
import { COLORS, RADIUS, SHADOW } from "./theme";

const VARIANTS = {
  success: { icon: CheckCircle, color: COLORS.success, bg: "#F0FDF4" },
  error: { icon: XCircle, color: COLORS.error, bg: "#FFF1F2" },
  warning: { icon: AlertTriangle, color: COLORS.warning, bg: "#FFFBEB" },
  info: { icon: Info, color: COLORS.info, bg: "#EFF6FF" },
  confirm: { icon: AlertTriangle, color: COLORS.primary, bg: COLORS.primaryLight },
};

/**
 * AlertModal — reusable modal for confirmations, errors, success, warnings
 * @param {boolean} visible
 * @param {function} onClose
 * @param {string} variant - "success" | "error" | "warning" | "info" | "confirm"
 * @param {string} title
 * @param {string} message
 * @param {string} confirmText
 * @param {string} cancelText
 * @param {function} onConfirm
 * @param {boolean} dismissOnBackdrop
 */
export default function AlertModal({
  visible,
  onClose,
  variant = "info",
  title,
  message,
  confirmText = "OK",
  cancelText,
  onConfirm,
  dismissOnBackdrop = true,
}) {
  const config = VARIANTS[variant];
  const Icon = config.icon;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={dismissOnBackdrop ? onClose : undefined}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              {/* Close button */}
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <X size={18} color={COLORS.textMuted} />
              </TouchableOpacity>

              {/* Icon */}
              <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>
                <Icon size={32} color={config.color} />
              </View>

              {/* Title */}
              {title && <Text style={styles.title}>{title}</Text>}

              {/* Message */}
              {message && <Text style={styles.message}>{message}</Text>}

              {/* Actions */}
              <View style={[styles.actions, cancelText ? styles.actionsRow : null]}>
                {cancelText && (
                  <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                    <Text style={styles.cancelText}>{cancelText}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.confirmBtn,
                    { backgroundColor: config.color },
                    cancelText && styles.confirmBtnFlex,
                  ]}
                  onPress={() => { onConfirm?.(); onClose?.(); }}
                >
                  <Text style={styles.confirmText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(28,25,23,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.xxl,
    padding: 28,
    width: "100%",
    alignItems: "center",
    ...SHADOW.md,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
  },
  actions: { width: "100%" },
  actionsRow: { flexDirection: "row", gap: 10 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    alignItems: "center",
  },
  cancelText: { fontSize: 15, fontWeight: "600", color: COLORS.textSecondary },
  confirmBtn: {
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    alignItems: "center",
    width: "100%",
  },
  confirmBtnFlex: { flex: 1, width: undefined },
  confirmText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});