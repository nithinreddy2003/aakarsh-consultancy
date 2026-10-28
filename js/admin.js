/* Admin Dashboard Logic
   Handles authentication, CRUD operations for jobs and achievements */

(async function() {
  "use strict";

  let client = null;
  let currentUserId = null;
  let currentTab = 'jobs';
  let editingJobId = null;
  let editingAchievementId = null;
  let deleteConfirmType = null;
  let deleteConfirmId = null;

  // =====================================================================
  // AUTHENTICATION & INITIALIZATION
  // =====================================================================

  async function initializeAdmin() {
    try {
      // Wait for Supabase client
      client = await window.getSupabaseClient();

      // Check authentication
      const isAuth = await window.isAuthenticated();
      if (!isAuth) {
        window.location.href = 'admin-login.html';
        return;
      }

      // Get current user
      const user = await window.getCurrentUser();
      if (!user) {
        window.location.href = 'admin-login.html';
        return;
      }

      currentUserId = user.id;

      // Check authorization
      const isUserAdmin = await window.isAdmin(user.id);
      if (!isUserAdmin) {
        await client.auth.signOut();
        window.location.href = 'admin-login.html';
        return;
      }

      // Update UI with user email
      document.getElementById('userEmail').textContent = user.email || 'Admin User';

      // Setup event listeners
      setupEventListeners();

      // Load initial data
      await loadJobs();
      await loadAchievements();

    } catch (err) {
      console.error('Init error:', err);
      showAlert('jobs', `Initialization error: ${err.message}`, 'danger');
    }
  }

  // =====================================================================
  // UI EVENT LISTENERS
  // =====================================================================

  function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        switchTab(tab);
      });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Jobs form
    document.getElementById('jobForm').addEventListener('submit', handleSaveJob);
    document.getElementById('jobResetBtn').addEventListener('click', resetJobForm);

    // Achievements form
    document.getElementById('achievementForm').addEventListener('submit', handleSaveAchievement);
    document.getElementById('achievementResetBtn').addEventListener('click', resetAchievementForm);

    // Delete modal
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
      console.log('confirmDeleteBtn clicked. deleteConfirmType:', deleteConfirmType, 'deleteConfirmId:', deleteConfirmId);
      confirmDelete();
    });
  }

  function switchTab(tab) {
    currentTab = tab;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === tab);
    });
  }

  // =====================================================================
  // ALERT HELPERS
  // =====================================================================

  function showAlert(tab, message, type = 'success') {
    const alertEl = document.getElementById(`${tab}Alert`);
    alertEl.textContent = message;
    alertEl.className = `alert show alert-${type}`;

    // Auto-hide after 5 seconds for non-error
    if (type !== 'danger') {
      setTimeout(() => {
        alertEl.className = 'alert';
        alertEl.textContent = '';
      }, 5000);
    }
  }

  // =====================================================================
  // DELETE MODAL
  // =====================================================================

  function openDeleteModal(type, id, itemName) {
    console.log('openDeleteModal called with:', { type, id, itemName, idType: typeof id });
    deleteConfirmType = type;
    deleteConfirmId = id;
    console.log('deleteConfirmId set to:', deleteConfirmId, 'type:', typeof deleteConfirmId);
    document.getElementById('deleteMessage').textContent = `Are you sure you want to delete "${itemName}"? This cannot be undone.`;
    document.getElementById('deleteModal').classList.add('show');
  }

  function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    deleteConfirmType = null;
    deleteConfirmId = null;
  }

  async function confirmDelete() {
    console.log('confirmDelete called with:', { deleteConfirmType, deleteConfirmId, idType: typeof deleteConfirmId });
    
    if (!deleteConfirmType || !deleteConfirmId) {
      console.warn('confirmDelete: Missing type or id. Type:', deleteConfirmType, 'ID:', deleteConfirmId);
      closeDeleteModal();
      return;
    }

    try {
      if (!client) {
        throw new Error('Supabase client not initialized. Please refresh the page.');
      }
      
      const table = deleteConfirmType === 'job' ? 'jobs' : 'achievements';
      
      // ID can be either integer or UUID - keep it in original format
      const idToDelete = deleteConfirmId;
      
      console.log('======== DELETE DEBUG START ========');
      console.log('Table:', table);
      console.log('ID to delete:', idToDelete);
      console.log('ID type:', typeof idToDelete);
      console.log('ID value (raw):', deleteConfirmId);
      console.log('Client exists:', !!client);
      console.log('======== END DEBUG INFO ========');
      
      if (!idToDelete) {
        throw new Error(`Invalid ID value: ${idToDelete}`);
      }
      
      console.log('Executing delete query...');
      const { data, error } = await client
        .from(table)
        .delete()
        .eq('id', idToDelete);

      if (error) {
        console.error('ERROR OBJECT:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error details:', error.details);
        throw error;
      }

      console.log('Delete successful! Data:', data);
      showAlert(currentTab, `${deleteConfirmType === 'job' ? 'Job' : 'Achievement'} deleted successfully.`, 'success');

      // Wait a moment for database to sync
      await new Promise(resolve => setTimeout(resolve, 500));

      if (deleteConfirmType === 'job') {
        await loadJobs();
      } else {
        await loadAchievements();
      }

    } catch (err) {
      console.error('CATCH - Delete error:', err.message);
      showAlert(currentTab, `Delete failed: ${err.message}`, 'danger');
    } finally {
      closeDeleteModal();
    }
  }

  // =====================================================================
  // JOBS CRUD
  // =====================================================================

  async function handleSaveJob(e) {
    e.preventDefault();

    const title = document.getElementById('jobTitle').value.trim();
    const company = document.getElementById('jobCompany').value.trim();
    const location = document.getElementById('jobLocation').value.trim();
    const employment_type = document.getElementById('jobType').value.trim();
    const experience = document.getElementById('jobExperience').value.trim();
    const skills = document.getElementById('jobSkills').value.trim();
    const description = document.getElementById('jobDescription').value.trim();
    const application_deadline = document.getElementById('jobDeadline').value || null;

    if (!title || !company || !location || !employment_type || !experience || !skills || !description) {
      showAlert('jobs', 'Please fill in all required fields.', 'danger');
      return;
    }

    try {
      const jobData = {
        title,
        company,
        location,
        employment_type,
        experience,
        skills,
        description,
        application_deadline,
        updated_at: new Date().toISOString()
      };

      if (editingJobId) {
        // Update existing job
        const { error } = await client
          .from('jobs')
          .update(jobData)
          .eq('id', editingJobId);

        if (error) throw error;
        showAlert('jobs', 'Job updated successfully.', 'success');
      } else {
        // Create new job
        const { error } = await client
          .from('jobs')
          .insert([{
            ...jobData,
            is_published: false,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        showAlert('jobs', 'Job created successfully.', 'success');
      }

      resetJobForm();
      await loadJobs();

    } catch (err) {
      console.error('Save job error:', err);
      showAlert('jobs', `Save failed: ${err.message}`, 'danger');
    }
  }

  async function loadJobs() {
    try {
      document.getElementById('jobsLoading').style.display = 'block';

      const { data, error } = await client
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      document.getElementById('jobsLoading').style.display = 'none';

      if (!data || data.length === 0) {
        document.getElementById('jobsContainer').innerHTML = `
          <div class="empty-state">
            <h3>No jobs yet</h3>
            <p>Create your first job posting using the form above.</p>
          </div>
        `;
        return;
      }

      const container = document.getElementById('jobsContainer');
      
      // DEBUG: Log first job to see actual structure
      if (data.length > 0) {
        console.log('First job object from Supabase:', data[0]);
        console.log('First job ID:', data[0].id, 'Type:', typeof data[0].id);
        console.log('All job keys:', Object.keys(data[0]));
      }
      
      const html = data.map((job, index) => `
        <div class="panel-form" style="margin-bottom: 20px;" data-job-index="${index}">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
            <div style="flex: 1;">
              <h3 style="margin: 0 0 4px 0;">${escapeHtml(job.title)}</h3>
              <p style="margin: 0 0 8px 0; color: var(--body);">${escapeHtml(job.company)} • ${escapeHtml(job.location)}</p>
              <span class="status-badge ${job.is_published ? 'status-published' : 'status-draft'}">
                ${job.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
          <div style="margin-bottom: 16px; font-size: 0.9rem; color: var(--body);">
            <p style="margin: 4px 0;"><strong>Type:</strong> ${escapeHtml(job.employment_type)}</p>
            <p style="margin: 4px 0;"><strong>Experience:</strong> ${escapeHtml(job.experience)}</p>
            <p style="margin: 4px 0;"><strong>Skills:</strong> ${escapeHtml(job.skills)}</p>
            <p style="margin: 4px 0;"><strong>Description:</strong> ${escapeHtml(job.description.substring(0, 100))}...</p>
            ${job.application_deadline ? `<p style="margin: 4px 0;"><strong>Deadline:</strong> ${job.application_deadline}</p>` : ''}
          </div>
          <div class="actions">
            <button class="btn-sm edit">Edit</button>
            <button class="btn-sm toggle">
              ${job.is_published ? 'Unpublish' : 'Publish'}
            </button>
            <button class="btn-sm delete">Delete</button>
          </div>
        </div>
      `).join('');

      container.innerHTML = html;

      // Add event listeners with closure to preserve data
      data.forEach((job, index) => {
        const jobCard = container.querySelector(`[data-job-index="${index}"]`);
        if (!jobCard) return;

        jobCard.querySelector('button.edit').addEventListener('click', () => {
          console.log('Edit job clicked. Job ID:', job.id, 'typeof:', typeof job.id);
          editJob(job.id);
        });
        jobCard.querySelector('button.toggle').addEventListener('click', () => {
          console.log('Toggle job clicked. Job ID:', job.id, 'typeof:', typeof job.id);
          toggleJobPublish(job.id, job.is_published);
        });
        jobCard.querySelector('button.delete').addEventListener('click', () => {
          console.log('Delete job clicked. Job ID:', job.id, 'typeof:', typeof job.id, 'Title:', job.title);
          deleteJob(job.id, job.title);
        });
      });

    } catch (err) {
      console.error('Load jobs error:', err);
      showAlert('jobs', `Load failed: ${err.message}`, 'danger');
      document.getElementById('jobsLoading').style.display = 'none';
    }
  }

  function resetJobForm() {
    document.getElementById('jobForm').reset();
    editingJobId = null;
    document.getElementById('jobsFormTitle').textContent = 'Add New Job';
  }

  async function editJob(jobId) {
    try {
      const { data, error } = await client
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;

      editingJobId = data.id;
      document.getElementById('jobsFormTitle').textContent = 'Edit Job';
      document.getElementById('jobTitle').value = data.title;
      document.getElementById('jobCompany').value = data.company;
      document.getElementById('jobLocation').value = data.location;
      document.getElementById('jobType').value = data.employment_type;
      document.getElementById('jobExperience').value = data.experience;
      document.getElementById('jobSkills').value = data.skills;
      document.getElementById('jobDescription').value = data.description;
      document.getElementById('jobDeadline').value = data.application_deadline || '';

      // Scroll to form
      document.getElementById('jobForm').scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
      console.error('Edit job error:', err);
      showAlert('jobs', `Load job failed: ${err.message}`, 'danger');
    }
  }

  async function toggleJobPublish(jobId, isCurrentlyPublished) {
    try {
      const { error } = await client
        .from('jobs')
        .update({ is_published: !isCurrentlyPublished })
        .eq('id', jobId);

      if (error) throw error;

      showAlert('jobs', `Job ${!isCurrentlyPublished ? 'published' : 'unpublished'} successfully.`, 'success');
      await loadJobs();

    } catch (err) {
      console.error('Toggle publish error:', err);
      showAlert('jobs', `Toggle failed: ${err.message}`, 'danger');
    }
  }

  function deleteJob(jobId, jobTitle) {
    openDeleteModal('job', jobId, jobTitle);
  }

  // =====================================================================
  // ACHIEVEMENTS CRUD
  // =====================================================================

  async function handleSaveAchievement(e) {
    e.preventDefault();

    const title = document.getElementById('achievementTitle').value.trim();
    const achievement_date = document.getElementById('achievementDate').value;
    const image_url = document.getElementById('achievementImageUrl').value.trim();
    const description = document.getElementById('achievementDescription').value.trim();

    if (!title || !achievement_date || !image_url || !description) {
      showAlert('achievements', 'Please fill in all required fields.', 'danger');
      return;
    }

    try {
      const achievementData = {
        title,
        achievement_date,
        image_url,
        description,
        updated_at: new Date().toISOString()
      };

      if (editingAchievementId) {
        // Update existing achievement
        const { error } = await client
          .from('achievements')
          .update(achievementData)
          .eq('id', editingAchievementId);

        if (error) throw error;
        showAlert('achievements', 'Achievement updated successfully.', 'success');
      } else {
        // Create new achievement
        const { error } = await client
          .from('achievements')
          .insert([{
            ...achievementData,
            is_published: false,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        showAlert('achievements', 'Achievement created successfully.', 'success');
      }

      resetAchievementForm();
      await loadAchievements();

    } catch (err) {
      console.error('Save achievement error:', err);
      showAlert('achievements', `Save failed: ${err.message}`, 'danger');
    }
  }

  async function loadAchievements() {
    try {
      document.getElementById('achievementsLoading').style.display = 'block';

      const { data, error } = await client
        .from('achievements')
        .select('*')
        .order('achievement_date', { ascending: false });

      if (error) throw error;

      document.getElementById('achievementsLoading').style.display = 'none';

      if (!data || data.length === 0) {
        document.getElementById('achievementsContainer').innerHTML = `
          <div class="empty-state">
            <h3>No achievements yet</h3>
            <p>Create your first achievement using the form above.</p>
          </div>
        `;
        return;
      }

      const container = document.getElementById('achievementsContainer');
      
      // DEBUG: Log first achievement to see actual structure
      if (data.length > 0) {
        console.log('First achievement object from Supabase:', data[0]);
        console.log('First achievement ID:', data[0].id, 'Type:', typeof data[0].id);
        console.log('All achievement keys:', Object.keys(data[0]));
      }
      
      const html = data.map((ach, index) => `
        <div class="panel-form" style="margin-bottom: 20px;" data-achievement-index="${index}">
          <div style="display: flex; justify-content: space-between; align-items: start; gap: 20px; margin-bottom: 16px;">
            <div style="flex: 1;">
              <h3 style="margin: 0 0 4px 0;">${escapeHtml(ach.title)}</h3>
              <p style="margin: 0 0 8px 0; color: var(--body); font-size: 0.9rem;">Date: ${ach.achievement_date}</p>
              <span class="status-badge ${ach.is_published ? 'status-published' : 'status-draft'}">
                ${ach.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
            ${ach.image_url ? `<img src="${escapeHtml(ach.image_url)}" alt="${escapeHtml(ach.title)}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">` : ''}
          </div>
          <p style="margin: 8px 0; font-size: 0.9rem; color: var(--body);">${escapeHtml(ach.description.substring(0, 100))}...</p>
          <div class="actions">
            <button class="btn-sm edit">Edit</button>
            <button class="btn-sm toggle">
              ${ach.is_published ? 'Unpublish' : 'Publish'}
            </button>
            <button class="btn-sm delete">Delete</button>
          </div>
        </div>
      `).join('');

      container.innerHTML = html;

      // Add event listeners with closure to preserve data
      data.forEach((ach, index) => {
        const achCard = container.querySelector(`[data-achievement-index="${index}"]`);
        if (!achCard) return;

        achCard.querySelector('button.edit').addEventListener('click', () => {
          console.log('Edit achievement clicked. Achievement ID:', ach.id, 'typeof:', typeof ach.id);
          editAchievement(ach.id);
        });
        achCard.querySelector('button.toggle').addEventListener('click', () => {
          console.log('Toggle achievement clicked. Achievement ID:', ach.id, 'typeof:', typeof ach.id);
          toggleAchievementPublish(ach.id, ach.is_published);
        });
        achCard.querySelector('button.delete').addEventListener('click', () => {
          console.log('Delete achievement clicked. Achievement ID:', ach.id, 'typeof:', typeof ach.id, 'Title:', ach.title);
          deleteAchievement(ach.id, ach.title);
        });
      });

    } catch (err) {
      console.error('Load achievements error:', err);
      showAlert('achievements', `Load failed: ${err.message}`, 'danger');
      document.getElementById('achievementsLoading').style.display = 'none';
    }
  }

  function resetAchievementForm() {
    document.getElementById('achievementForm').reset();
    editingAchievementId = null;
    document.getElementById('achievementsFormTitle').textContent = 'Add New Achievement';
  }

  async function editAchievement(achievementId) {
    try {
      const { data, error } = await client
        .from('achievements')
        .select('*')
        .eq('id', achievementId)
        .single();

      if (error) throw error;

      editingAchievementId = data.id;
      document.getElementById('achievementsFormTitle').textContent = 'Edit Achievement';
      document.getElementById('achievementTitle').value = data.title;
      document.getElementById('achievementDate').value = data.achievement_date;
      document.getElementById('achievementImageUrl').value = data.image_url;
      document.getElementById('achievementDescription').value = data.description;

      // Scroll to form
      document.getElementById('achievementForm').scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
      console.error('Edit achievement error:', err);
      showAlert('achievements', `Load achievement failed: ${err.message}`, 'danger');
    }
  }

  async function toggleAchievementPublish(achievementId, isCurrentlyPublished) {
    try {
      const { error } = await client
        .from('achievements')
        .update({ is_published: !isCurrentlyPublished })
        .eq('id', achievementId);

      if (error) throw error;

      showAlert('achievements', `Achievement ${!isCurrentlyPublished ? 'published' : 'unpublished'} successfully.`, 'success');
      await loadAchievements();

    } catch (err) {
      console.error('Toggle publish error:', err);
      showAlert('achievements', `Toggle failed: ${err.message}`, 'danger');
    }
  }

  function deleteAchievement(achievementId, title) {
    openDeleteModal('achievement', achievementId, title);
  }

  // =====================================================================
  // LOGOUT
  // =====================================================================

  async function logout() {
    try {
      const { error } = await client.auth.signOut();
      if (error) throw error;
      window.location.href = 'admin-login.html';
    } catch (err) {
      console.error('Logout error:', err);
      alert('Logout failed. Redirecting...');
      window.location.href = 'admin-login.html';
    }
  }

  // =====================================================================
  // UTILITY FUNCTIONS
  // =====================================================================

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // =====================================================================
  // START
  // =====================================================================

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdmin);
  } else {
    initializeAdmin();
  }

})();
