import { MapPin, Mail, Phone } from 'lucide-react';

export function PublicFooter({ church }: { church: any }) {
  return (
    <footer className="border-t bg-card">
      <div className="container grid gap-8 py-10 md:grid-cols-3">
        <div>
          <h3 className="mb-2 font-bold">{church?.nama || 'WKC Church'}</h3>
          <p className="text-sm text-muted-foreground">Membangun komunitas yang terhubung, bertumbuh, dan melayani sejak 1995.</p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {church?.alamat}, {church?.kota}</p>
          <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {church?.telepon}</p>
          <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {church?.email}</p>
        </div>
        <div className="text-sm text-muted-foreground md:text-right">
          <p>&copy; {new Date().getFullYear()} {church?.nama}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
