/**
 * Main Application Logic & User Interactions
 * Amrutha & Mohan Kumar Wedding Invitation
 */

(function() {
  'use strict';

  // Venue information
  const VENUE_NAME = 'Daivajna Kalyana Mantapa';
  const VENUE_ADDRESS = 'Daivajna Kalyana Mantapa, Renuka Layout, P.B. Road, Davanagere – 577 002, Karnataka';
  const MAPS_URL = 'https://maps.google.com/?q=Daivajna+Kalyana+Mantapa+Renuka+Layout+PB+Road+Davanagere+577002';

  // --------------------------------------------------------------------------
  // 1. Toast Notification System
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 2. Copy Address to Clipboard
  // --------------------------------------------------------------------------
  const copyAddressBtn = document.getElementById('copy-address-btn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(VENUE_ADDRESS).then(() => {
          showToast('✓ Venue address copied to clipboard');
        }).catch(() => {
          fallbackCopyText(VENUE_ADDRESS);
        });
      } else {
        fallbackCopyText(VENUE_ADDRESS);
      }
    });
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('✓ Venue address copied to clipboard');
    } catch (err) {
      showToast('Venue: ' + VENUE_ADDRESS);
    }
    document.body.removeChild(textArea);
  }

  // --------------------------------------------------------------------------
  // 3. Calendar Modal & Event Creation (.ics & Google Calendar)
  // --------------------------------------------------------------------------
  const calendarModal = document.getElementById('calendar-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalEventTitle = document.getElementById('modal-event-title');
  const googleCalLink = document.getElementById('google-cal-link');
  const icalDownloadBtn = document.getElementById('ical-download-btn');

  // Event Data Definitions (Accurate Official Timings)
  const EVENTS = {
    wedding: {
      title: 'Amrutha & Mohan Kumar Wedding (Muhurtham)',
      description: 'Sacred Muhurtham ceremony of Amrutha K.V. and Mohan Kumar P.A. (Dhanusu Lagna: 8:30 AM - 9:25 AM) at Daivajna Kalyana Mantapa, Davanagere.',
      location: VENUE_ADDRESS,
      startUtc: '20261206T030000Z', // 08:30 IST = 03:00 UTC
      endUtc: '20261206T035500Z',   // 09:25 IST = 03:55 UTC
      startDateText: '6 December 2026, 8:30 AM - 9:25 AM'
    },
    reception: {
      title: 'Amrutha & Mohan Kumar Wedding Reception',
      description: 'Wedding Reception of Amrutha K.V. and Mohan Kumar P.A. (7:30 PM onwards) at Daivajna Kalyana Mantapa, Davanagere.',
      location: VENUE_ADDRESS,
      startUtc: '20261205T140000Z', // 19:30 IST = 14:00 UTC
      endUtc: '20261205T173000Z',   // 23:00 IST = 17:30 UTC
      startDateText: '5 December 2026, 7:30 PM onwards'
    }
  };

  let activeEventKey = 'wedding';

  function openCalendarModal(eventKey) {
    if (!calendarModal) return;
    activeEventKey = eventKey;
    const evt = EVENTS[eventKey];

    if (modalEventTitle) {
      modalEventTitle.textContent = evt.title;
    }

    // Google Calendar Link
    if (googleCalLink) {
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evt.title)}&dates=${evt.startUtc}/${evt.endUtc}&details=${encodeURIComponent(evt.description)}&location=${encodeURIComponent(evt.location)}`;
      googleCalLink.href = gcalUrl;
    }

    calendarModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCalendarModal() {
    if (!calendarModal) return;
    calendarModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Trigger modal from buttons
  document.querySelectorAll('[data-calendar-event]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventType = btn.getAttribute('data-calendar-event');
      openCalendarModal(eventType);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCalendarModal);
  }

  if (calendarModal) {
    calendarModal.addEventListener('click', (e) => {
      if (e.target === calendarModal) {
        closeCalendarModal();
      }
    });
  }

  // Escape key to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && calendarModal && calendarModal.classList.contains('active')) {
      closeCalendarModal();
    }
  });

  // Generate & Download .ics File for Apple / Outlook / Mobile Calendar
  if (icalDownloadBtn) {
    icalDownloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const evt = EVENTS[activeEventKey];
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Amrutha & Mohan Kumar//Wedding Invitation//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:wedding-${activeEventKey}-20261206@wedding-invitation`,
        `DTSTAMP:${evt.startUtc}`,
        `DTSTART:${evt.startUtc}`,
        `DTEND:${evt.endUtc}`,
        `SUMMARY:${evt.title}`,
        `DESCRIPTION:${evt.description}`,
        `LOCATION:${evt.location}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `${activeEventKey}-amrutha-mohankumar.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('✓ Calendar event file (.ics) downloaded');
      closeCalendarModal();
    });
  }

  // --------------------------------------------------------------------------
  // 4. Smooth Anchor Scrolling
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

})();

