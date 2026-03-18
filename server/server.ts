import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import scheduleData from '../src/data/schedule.json' assert { type: 'json' };
import holidaysData from '../src/data/holidays.json' assert { type: 'json' };
import specialPeriodsData from '../src/data/special-periods.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files dari dist folder (React frontend build)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Mock lesson data - in a real app, this would come from a database
// For now, we'll return empty/placeholder data
const mockLessonData: Record<string, any> = {
  'Indo': [],
  'mtk': [],
  'IPAS': [],
  'PKN': [],
  'seni': [],
};

// API Routes
app.get('/api/schedule', (req: Request, res: Response) => {
  res.json(scheduleData);
});

app.get('/api/holidays', (req: Request, res: Response) => {
  res.json(holidaysData);
});

app.get('/api/special-periods', (req: Request, res: Response) => {
  res.json(specialPeriodsData);
});

app.get('/api/lessons', (req: Request, res: Response) => {
  const { subject, date } = req.query;
  
  if (!subject || !date) {
    return res.status(400).json({ error: 'Missing subject or date parameter' });
  }

  // Return placeholder data
  // In a production app, you would:
  // 1. Connect to a database
  // 2. Query for lesson data based on subject and date
  // 3. Return the actual lesson data
  
  const lessonData = mockLessonData[subject as string] || [];
  
  if (lessonData.length === 0) {
    return res.status(404).json({ 
      error: 'Tidak ada data pembelajaran untuk tanggal ini',
      message: 'Silakan tambahkan data pembelajaran melalui Google Sheets atau database'
    });
  }

  res.json(lessonData[0] || null);
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server berjalan dengan baik' });
});

// SPA Routing - serve index.html untuk semua route yang tidak cocok API
app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err: any) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`� Frontend: http://localhost:${PORT}`);
  console.log(`�📋 API Schedule: http://localhost:${PORT}/api/schedule`);
  console.log(`🎓 API Holidays: http://localhost:${PORT}/api/holidays`);
  console.log(`📌 API Special Periods: http://localhost:${PORT}/api/special-periods`);
  console.log(`📖 API Lessons: http://localhost:${PORT}/api/lessons?subject=Indo&date=2026-03-01\n`);
});

export default app;
