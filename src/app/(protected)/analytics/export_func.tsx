import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateAnalyticsPDF = (
  productivityMetrics: Array<{ label: string; value: string; change: string; trend: string }>,
  weeklyActivity: Array<{ day: string; hours: number }>,
  topSubjects: Array<{ name: string; hours: number; percentage: number }>
) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(18);
  doc.text('StudySync Analytics Report', 15, 20);
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 15, 28);

  // Key metrics table
  autoTable(doc, {
    startY: 45,
    head: [['Metric', 'Value', 'Change', 'Trend']],
    body: productivityMetrics.map(m => [m.label, m.value, m.change, m.trend]),
    theme: 'grid',
    styles: { fontSize: 10 }
  });

  // Weekly activity chart
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Weekly Activity', 15, 20);
  autoTable(doc, {
    startY: 25,
    head: [['Day', 'Hours Studied']],
    body: weeklyActivity.map(w => [w.day, w.hours]),
    theme: 'grid',
    styles: { fontSize: 10 }
  });

  // Subject distribution
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Subject Distribution', 15, 20);
  autoTable(doc, {
    startY: 25,
    head: [['Subject', 'Hours', 'Percentage']],
    body: topSubjects.map(s => [s.name, s.hours, `${s.percentage}%`]),
    theme: 'grid',
    styles: { fontSize: 10 }
  });

  return doc;
};