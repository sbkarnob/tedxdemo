class SupabaseClient {
    constructor() {
        this.client = null;
        this.currentUser = null;
        this.init();
    }
    init() {
        if (typeof supabase === 'undefined') { console.error('Supabase JS not loaded'); return; }
        if (!window.CONFIG || !window.CONFIG.SUPABASE_URL || !window.CONFIG.SUPABASE_ANON_KEY) { console.error('Config empty'); return; }
        if (window.CONFIG.SUPABASE_URL.indexOf('supabase.co') === -1) { console.error('Config URL wrong'); return; }

        try {
            this.client = supabase.createClient(window.CONFIG.SUPABASE_URL, window.CONFIG.SUPABASE_ANON_KEY);
            this.client.auth.onAuthStateChange((e, s) => { this.currentUser = s?.user || null; });
            this.client.auth.getSession().then(({ data: { session } }) => { this.currentUser = session?.user || null; }).catch(() => {});
        } catch(err) { console.error('Init error:', err); }
    }
    async signIn(email, password) {
        if (!this.client) throw new Error('Not connected');
        const { data, error } = await this.client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    }
    async signOut() { if (!this.client) return; const { error } = await this.client.auth.signOut(); if (error) throw error; this.currentUser = null; }
    async getSession() { if (!this.client) return null; const { data, error } = await this.client.auth.getSession(); if (error) return null; return data.session; }
    isAuthenticated() { return !!this.currentUser; }

    async getAll(table) {
        if (!this.client) throw new Error('Not connected');
        const { data, error } = await this.client.from(table).select('*').order('order_index', { ascending: true });
        if (error) throw error;
        return data;
    }
    async getActive(table) {
        if (!this.client) throw new Error('Not connected');
        const { data, error } = await this.client.from(table).select('*').eq('is_active', true).order('order_index', { ascending: true });
        if (error) throw error;
        return data;
    }
    async getById(table, id) {
        if (!this.client) throw new Error('Not connected');
        const { data, error } = await this.client.from(table).select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    }
    async create(table, d) {
        if (!this.client) throw new Error('Not connected');
        const { data, error } = await this.client.from(table).insert(d).select().single();
        if (error) throw error;
        return data;
    }
    async update(table, id, d) {
        if (!this.client) throw new Error('Not connected');
        d.updated_at = new Date().toISOString();
        const { data, error } = await this.client.from(table).update(d).eq('id', id).select().single();
        if (error) throw error;
        return data;
    }
    async remove(table, id) {
        if (!this.client) throw new Error('Not connected');
        const { error } = await this.client.from(table).delete().eq('id', id);
        if (error) throw error;
    }
    async getEventDetails() {
        if (!this.client) throw new Error('Not connected');
        const { data, error } = await this.client.from('event_details').select('*');
        if (error) throw error;
        const o = {}; data.forEach(i => { o[i.key] = i.value; }); return o;
    }
    async updateEventDetail(k, v) {
        if (!this.client) throw new Error('Not connected');
        const { data, error } = await this.client.from('event_details').upsert({ key: k, value: v, updated_at: new Date().toISOString() }).select().single();
        if (error) throw error;
        return data;
    }
    async submitMessage(d) {
        if (!this.client) throw new Error('Not connected');
        const { data, error } = await this.client.from('contact_messages').insert({ name: d.name, email: d.email, subject: d.subject, message: d.message }).select().single();
        if (error) throw error;
        return data;
    }
    async getMessages() {
        if (!this.client) throw new Error('Not connected');
        const { data, error } = await this.client.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }
    async markRead(id) { if (!this.client) throw new Error('Not connected'); const { error } = await this.client.from('contact_messages').update({ is_read: true }).eq('id', id); if (error) throw error; }
    async deleteMessage(id) { if (!this.client) throw new Error('Not connected'); const { error } = await this.client.from('contact_messages').delete().eq('id', id); if (error) throw error; }
    async unreadCount() { if (!this.client) throw new Error('Not connected'); const { count, error } = await this.client.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false); if (error) throw error; return count; }
    async getAdminProfile() {
        if (!this.client || !this.currentUser) return null;
        const { data, error } = await this.client.from('admin_users').select('*').eq('user_id', this.currentUser.id).single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }
    async createAdminProfile(n) {
        if (!this.client || !this.currentUser) throw new Error('Not authenticated');
        const { data, error } = await this.client.from('admin_users').upsert({ user_id: this.currentUser.id, full_name: n }).select().single();
        if (error) throw error;
        return data;
    }

    async uploadImage(file, folder) {
        if (!this.client) throw new Error('Supabase not connected');

        var ext = file.name.split('.').pop();
        var fname = Date.now().toString() + Math.random().toString(36).substring(2, 10) + '.' + ext;

        console.log('UPLOADING:', folder + '/' + fname, '|', 'Type:', file.type, '|', 'Size:', (file.size/1024).toFixed(1) + 'KB');

        var { data: ud, error: ue } = await this.client.storage
            .from(window.CONFIG.STORAGE_BUCKET)
            .upload(folder + '/' + fname, file, { cacheControl: '3600', upsert: false });

        if (ue) {
            console.error('UPLOAD ERROR:', ue);
            throw new Error('Upload failed: ' + ue.message);
        }

        var { data: urlData } = this.client.storage
            .from(window.CONFIG.STORAGE_BUCKET)
            .getPublicUrl(ud.path);

        console.log('UPLOADED:', urlData.publicUrl);
        return urlData.publicUrl;
    }
}

window.db = new SupabaseClient();