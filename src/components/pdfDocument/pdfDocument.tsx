import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { formatNumber } from "../../utils";

interface TransactionDetail {
  id: string;
  sparePartId: number;
  equipmentId: number;
  quantity: number;
  price: number;
}

interface Transaction {
  id: string;
  userId: string;
  transactionDate: string;
  status: string;
  invoice: string;
  totalAmount: number;
  transactionDetails: TransactionDetail[];
}

interface PDFDocumentProps {
  transaction: Transaction;
  userMap: Map<string, string>;
  equipmentMap: Map<number, string>;
  sparePartMap: Map<number, string>;
}

const styles = StyleSheet.create({
  invoice: {
    padding: 30,
    margin: "20px auto",
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    border: "1px solid #EEE",
  },
  top: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    marginBottom: 20,
    paddingBottom: 20,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  info: {
    fontSize: 12,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    fontSize: 12,
    fontWeight: "bold",
    padding: 5,
  },
  tableRow: {
    flexDirection: "row",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    padding: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: "left",
    padding: 8,
    fontSize: 12,
  },
  tableCellRight: {
    flex: 1,
    textAlign: "right",
    padding: 8,
    fontSize: 12,
  },
  totalSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    fontWeight: "bold",
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
    textAlign: "right",
  },
  legal: {
    marginTop: 40,
    fontSize: 10,
    textAlign: "center",
    color: "#999",
  },
});

const PDFDocument: React.FC<PDFDocumentProps> = ({ transaction, userMap, equipmentMap, sparePartMap }) => {
  const sparePartDetails = (transaction.transactionDetails || []).filter(
    (detail) => detail.sparePartId !== null
  );
  const equipmentDetails = (transaction.transactionDetails || []).filter(
    (detail) => detail.equipmentId !== null
  );

  return (
    <Document>
      <Page size="A4" style={styles.invoice}>
        <View style={styles.top}>
          <Text style={styles.title}>HEAVY EQUIPMENT INVOICE</Text>
          <Text style={styles.info}>Transaction Number: {transaction.id}</Text>
          <Text style={styles.info}>User: {userMap.get(transaction.userId) || "Unknown User"}</Text>
          <Text style={styles.info}>
            Transaction Date: {new Date(transaction.transactionDate).toLocaleDateString()}
          </Text>
          <Text style={styles.info}>Status: {transaction.status}</Text>
          <Text style={styles.info}>Invoice: {transaction.invoice}</Text>
        </View>

        <View>
          {sparePartDetails.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Spare Parts Details</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableCell}>Spare Part</Text>
                  <Text style={styles.tableCell}>Quantity</Text>
                  <Text style={styles.tableCellRight}>Sub Total</Text>
                </View>
                {sparePartDetails.map((detail) => (
                  <View key={detail.id} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{sparePartMap.get(detail.sparePartId) || "-"}</Text>
                    <Text style={styles.tableCell}>{detail.quantity}</Text>
                    <Text style={styles.tableCellRight}>{formatNumber(detail.price * detail.quantity)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {equipmentDetails.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Equipment Details</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableCell}>Equipment</Text>
                  <Text style={styles.tableCell}>Quantity</Text>
                  <Text style={styles.tableCellRight}>Sub Total</Text>
                </View>
                {equipmentDetails.map((detail) => (
                  <View key={detail.id} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{equipmentMap.get(detail.equipmentId) || "N/A"}</Text>
                    <Text style={styles.tableCell}>{detail.quantity}</Text>
                    <Text style={styles.tableCellRight}>{formatNumber(detail.price * detail.quantity)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total Transaction:</Text>
            <Text style={styles.totalValue}>{formatNumber(transaction.totalAmount)}</Text>
          </View>

          <Text style={styles.legal}>
            Thank you for your business! Payment is expected within 31 days; please process this invoice
            within that time. There will be a 5% interest charge per month on late invoices.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;
