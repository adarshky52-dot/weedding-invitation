/**
 * Main Application Logic & User Interactions
 * Amrutha & Mohan Kumar Wedding Invitation
 * 
 * - Toast Notification System
 * - Copy Address with iOS Safari & Mobile Webview Fallback
 * - Calendar Integration (Google Calendar URL & RFC 5545 .ics generation)
 * - Modal Dialog Accessibility
 * - Smooth Scrolling
 */

(function() {
  'use strict';

  // Official Venue Details
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
  // 2. Copy Address to Clipboard (with iOS Safari & In-App Webview Fallback)
  // --------------------------------------------------------------------------
  const copyAddressBtn = document.getElementById('copy-address-btn');

  function copyAddressToClipboard() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(VENUE_ADDRESS).then(() => {
        showToast('✓ Venue address copied to clipboard');
      }).catch(() => {
        fallbackCopyText(VENUE_ADDRESS);
      });
    } else {
      fallbackCopyText(VENUE_ADDRESS);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // iOS Safari & mobile in-app browser compatible styling
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);

    // Cross-platform selection
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showToast('✓ Venue address copied to clipboard');
      } else {
        showToast('Address: ' + text);
      }
    } catch (err) {
      showToast('Address: ' + text);
    }
    document.body.removeChild(textArea);
  }

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', copyAddressToClipboard);
  }

  // --------------------------------------------------------------------------
  // 3. Calendar Integration (RFC 5545 iCalendar & Google Calendar)
  // --------------------------------------------------------------------------
  const calendarModal = document.getElementById('calendar-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalEventTitle = document.getElementById('modal-event-title');
  const googleCalLink = document.getElementById('google-cal-link');
  const icalDownloadBtn = document.getElementById('ical-download-btn');

  // Event Data Definitions
  // Important: Reception is "7:30 PM onwards" - endUtc is null (no invented end time)
  // Wedding Muhurtham is 8:30 AM - 9:25 AM IST (03:00 - 03:55 UTC)
  const EVENTS = {
    wedding: {
      key: 'wedding',
      title: 'Amrutha & Mohan Kumar Wedding (Muhurtham)',
      description: 'Sacred Muhurtham ceremony of Amrutha K.V. and Mohan Kumar P.A. (Dhanusu Lagna: 8:30 AM - 9:25 AM) at Daivajna Kalyana Mantapa, Davanagere.',
      location: VENUE_ADDRESS,
      startUtc: '20261206T030000Z', // 08:30 IST = 03:00 UTC
      endUtc: '20261206T035500Z',   // 09:25 IST = 03:55 UTC
      startDateText: '6 December 2026, 8:30 AM - 9:25 AM',
      uid: 'wedding-muhurtham-20261206@amrutha-mohankumar'
    },
    reception: {
      key: 'reception',
      title: 'Amrutha & Mohan Kumar Wedding Reception',
      description: 'Wedding Reception of Amrutha K.V. and Mohan Kumar P.A. (7:30 PM onwards) at Daivajna Kalyana Mantapa, Davanagere.',
      location: VENUE_ADDRESS,
      startUtc: '20261205T140000Z', // 19:30 IST = 14:00 UTC
      endUtc: null,                 // Official specification: 7:30 PM onwards, no invented end time
      startDateText: '5 December 2026, 7:30 PM onwards',
      uid: 'wedding-reception-20261205@amrutha-mohankumar'
    }
  };

  let activeEventKey = 'wedding';

  // RFC 5545 Text Escaping: commas, semicolons, backslashes, and newlines
  function escapeIcsText(str) {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\r?\n/g, '\\n');
  }

  // RFC 5545 Section 3.1 Line Folding (maximum 75 octets per line)
  function foldIcsLine(line) {
    const maxLen = 75;
    if (line.length <= maxLen) return line;

    let result = '';
    let current = line;
    let isFirst = true;

    while (current.length > (isFirst ? maxLen : maxLen - 1)) {
      const limit = isFirst ? maxLen : maxLen - 1;
      result += (isFirst ? '' : '\r\n ') + current.slice(0, limit);
      current = current.slice(limit);
      isFirst = false;
    }
    if (current.length > 0) {
      result += (isFirst ? '' : '\r\n ') + current;
    }
    return result;
  }

  // Build Google Calendar template URL
  function buildGCalUrl(evt) {
    // If no end time specified (Reception 7:30 PM onwards), dates=START/START creates point-in-time event
    const dates = evt.endUtc ? `${evt.startUtc}/${evt.endUtc}` : `${evt.startUtc}/${evt.startUtc}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evt.title)}&dates=${dates}&details=${encodeURIComponent(evt.description)}&location=${encodeURIComponent(evt.location)}`;
  }

  // Build RFC 5545 .ics formatted calendar string
  function buildIcsContent(evt) {
    const nowUtc = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Amrutha & Mohan Kumar//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${evt.uid}`,
      `DTSTAMP:${nowUtc}`,
      `DTSTART:${evt.startUtc}`
    ];

    // RFC 5545 Section 3.6.1: Omit DTEND when event has no fixed end time (e.g. 7:30 PM onwards)
    if (evt.endUtc) {
      lines.push(`DTEND:${evt.endUtc}`);
    }

    lines.push(
      `SUMMARY:${escapeIcsText(evt.title)}`,
      `DESCRIPTION:${escapeIcsText(evt.description)}`,
      `LOCATION:${escapeIcsText(evt.location)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    );

    // Apply RFC 5545 line folding and CRLF formatting
    return lines.map(foldIcsLine).join('\r\n');
  }

  function openCalendarModal(eventKey) {
    if (!calendarModal) return;
    activeEventKey = eventKey || 'wedding';
    const evt = EVENTS[activeEventKey];

    if (modalEventTitle) {
      modalEventTitle.textContent = evt.title;
    }

    if (googleCalLink) {
      googleCalLink.href = buildGCalUrl(evt);
    }

    calendarModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCalendarModal() {
    if (!calendarModal) return;
    calendarModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Trigger modal from calendar action buttons
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

  // Escape key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && calendarModal && calendarModal.classList.contains('active')) {
      closeCalendarModal();
    }
  });

  // Download .ics file
  if (icalDownloadBtn) {
    icalDownloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const evt = EVENTS[activeEventKey];
      const icsString = buildIcsContent(evt);

      const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `${activeEventKey}-amrutha-mohankumar.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);

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

  // Expose pure functions for automated verification and testing
  window.WeddingMain = {
    EVENTS: EVENTS,
    buildGCalUrl: buildGCalUrl,
    buildIcsContent: buildIcsContent,
    escapeIcsText: escapeIcsText,
    copyAddress: copyAddressToClipboard,
    openModal: openCalendarModal,
    closeModal: closeCalendarModal
  };

})();
