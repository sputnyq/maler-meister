import { Card, CardContent, Theme, useTheme } from '@mui/material';

import FullCalendar from '@fullcalendar/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { loadConstructions, loadDailyEntries } from '../../fetch/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useHolidays } from '../../hooks/useHolidays';
import { useIsSmall } from '../../hooks/useIsSmall';
import { AppState } from '../../store';
import { getColorHex, userFullName } from '../../utilities';
import { holidays2Events } from '../../utilities/cal-functions';
import EditConstructionDialog from '../constructions/EditConstructionDialog';
import { DailyEntryViewDialog } from '../time-capture/DailyEntryViewDialog';
import { ShiftPlanDialog } from './shift-plan-dialog';

import { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import deLocale from '@fullcalendar/core/locales/de';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import timeGridPlugin from '@fullcalendar/timegrid';
import { addDays, formatISO } from 'date-fns';

const COLOR_CODES = [
  '#213363',
  '#71e2fa',
  '#884A39',
  '#5856d6',
  '#B5C99A',
  '#0c6378',
  '#ECCCB2',
  '#FF52A2',
  '#808994',
  '#0e738a',
  '#ae2c1c',
];

type CalEventType = 'CONSTRUCTION' | 'DAILY_ENTRY' | 'PLAN_ENTRY';

type ExtendedProps = {
  type: CalEventType;
  id: number | string;
};

const TIME_GRID_WEEK = 'timeGridWeek';

export default function CalendarView() {
  const [constructionDialog, setConstructionDialog] = useState(false);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [dailyEntryDialog, setDailyEntryDialog] = useState(false);

  const [weekends, setWeekends] = useState(true);
  const [curYear, setCurYear] = useState(new Date().getFullYear());
  const [multiMonthMaxColumns, setMultiMonthMaxColumns] = useState(2);
  const [eventRange, setEventRange] = useState<EventDateRange>({});
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [constructions, setConstructions] = useState<Construction[]>([]);
  const [update, setUpdate] = useState(0);

  const theme = useTheme();

  const idRef = useRef<undefined | string | number>(undefined);
  const dateSelectArg = useRef<DateSelectArg | null>(null);
  const viewType = useRef<string | null>(null);

  const small = useIsSmall();
  const users = useSelector<AppState, User[]>((s) => s.users.all);

  const user = useCurrentUser();
  const holidays = useHolidays(curYear);

  useEffect(() => {
    const newYear = eventRange.start?.getFullYear();
    newYear && setCurYear(newYear);
  }, [eventRange]);

  useEffect(() => {
    const queryObj = {
      filters: {
        tenant: user?.tenant,
        start: {
          $lte: formatISO(eventRange.end || new Date(), { representation: 'date' }),
        },
        end: {
          $gte: formatISO(eventRange.start || new Date(), { representation: 'date' }),
        },
      },
      pagination: {
        pageSize: 100,
      },
    };
    loadConstructions(queryObj).then((res) => {
      if (res) {
        setConstructions(res.constructions);
      }
    });
  }, [eventRange, user, update]);

  useEffect(() => {
    const queryObj = {
      filters: {
        type: {
          $in: ['Urlaub', 'Schule'],
        },
        tenant: user?.tenant,
        date: {
          $gte: formatISO(eventRange.start || new Date(), { representation: 'date' }),
          $lte: formatISO(eventRange.end || new Date(), { representation: 'date' }),
        },
      },
      pagination: {
        pageSize: 100,
      },
    };
    loadDailyEntries(queryObj).then((res) => {
      if (res) {
        setDailyEntries(res.dailyEntries);
      }
    });
  }, [eventRange, user]);

  const events = useMemo(() => {
    const holidayEvents = holidays2Events(holidays);
    const vacationEvents = dailyEntries2Event(dailyEntries, users, theme);
    const constructionEvents = constructions2Events(constructions);

    return [...holidayEvents, ...vacationEvents, ...constructionEvents];
  }, [holidays, dailyEntries, users, constructions, theme]);

  const customButtons = useMemo(() => {
    const zoomIn = () => {
      setMultiMonthMaxColumns((cur) => Math.min(cur + 1, 3));
    };

    const zoomOut = () => {
      setMultiMonthMaxColumns((cur) => Math.max(cur - 1, 1));
    };
    return {
      plus: {
        text: 'Vergrößern',
        click: zoomOut,
      },
      minus: {
        text: 'Verkleinern',
        click: zoomIn,
      },
      weekends: {
        text: 'WE',
        click: () => {
          setWeekends((we) => !we);
        },
      },
    };
  }, []);

  const headerToolbar = useMemo(() => {
    return {
      left: small ? 'prev,next today' : 'prev,next today weekends',
      center: small ? undefined : 'title',
      right: small ? 'multiMonthYear,timeGridWeek' : 'minus,plus multiMonthYear,timeGridWeek',
    };
  }, [small]);

  const handleDateSelect = useCallback((arg: DateSelectArg) => {
    idRef.current = undefined;
    dateSelectArg.current = arg;

    if (viewType.current === TIME_GRID_WEEK) {
      setPlanDialogOpen(true);
    } else {
      setConstructionDialog(true);
    }
  }, []);

  const handleEventClick = useCallback((arg: EventClickArg) => {
    const ext = arg.event.extendedProps as ExtendedProps;

    idRef.current = ext.id;
    switch (ext.type) {
      case 'CONSTRUCTION':
        setConstructionDialog(true);
        break;

      case 'DAILY_ENTRY':
        setDailyEntryDialog(true);
        break;
      case 'PLAN_ENTRY':
        setPlanDialogOpen(true);
        break;
      default:
        return;
    }
  }, []);

  const onClose = useCallback((func: (bool: boolean) => void) => {
    func(false);
    setUpdate((u) => u + 1);
  }, []);

  return (
    <>
      <ShiftPlanDialog
        id={idRef.current}
        dateSelectArg={dateSelectArg.current}
        open={planDialogOpen}
        onClose={() => onClose(setPlanDialogOpen)}
      />
      <DailyEntryViewDialog
        closeDialog={() => onClose(setDailyEntryDialog)}
        dialogOpen={dailyEntryDialog}
        dailyEntryId={idRef.current}
      />
      <EditConstructionDialog
        initStart={
          dateSelectArg.current?.startStr &&
          formatISO(new Date(dateSelectArg.current.startStr), { representation: 'date' })
        }
        initEnd={
          dateSelectArg.current?.endStr &&
          formatISO(addDays(new Date(dateSelectArg.current?.endStr), -1), { representation: 'date' })
        }
        dialogOpen={constructionDialog}
        constructionId={idRef.current}
        onClose={() => onClose(setConstructionDialog)}
      />
      <Card>
        <CardContent>
          <FullCalendar
            weekends={weekends}
            events={events}
            height={'calc(100vh - 170px)'}
            datesSet={setEventRange}
            selectable
            select={handleDateSelect}
            eventClick={handleEventClick}
            weekNumbers
            headerToolbar={headerToolbar}
            customButtons={customButtons}
            locale={deLocale}
            plugins={[multiMonthPlugin, timeGridPlugin, interactionPlugin]}
            multiMonthMaxColumns={multiMonthMaxColumns}
            initialView="multiMonthYear"
            viewDidMount={({ view }) => {
              viewType.current = view.type;
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}

function dailyEntries2Event(dailyEntries: DailyEntry[], users: User[], theme: Theme): EventInput[] {
  return dailyEntries.map((de) => {
    const user = users.find((u) => u.username === de.username);

    const name = user ? userFullName(user) : de.username;

    return {
      date: de.date,
      title: name,
      color: getColorHex(de.type, theme),
      textColor: 'white',
      allDay: true,
      extendedProps: {
        type: 'DAILY_ENTRY',
        id: de.id,
      },
    } as EventInput;
  });
}

function constructions2Events(constructions: Construction[]): EventInput[] {
  return constructions.map((cstr, index) => {
    const curColor = COLOR_CODES[index % COLOR_CODES.length];

    const obj: EventInput = {
      allDay: true,
      title: `[${cstr.allocatedPersons || ''}] ${cstr.name}`,
      start: new Date(cstr.start),
      end: addDays(new Date(cstr.end), 1),
      textColor: curColor,
      borderColor: curColor,
      backgroundColor: 'white',
      className: cstr.active ? '' : ['not-active'],

      extendedProps: {
        type: 'CONSTRUCTION',
        id: cstr.id,
      },
    };

    if (cstr.confirmed) {
      return {
        ...obj,
        backgroundColor: curColor,
        textColor: 'white',
      } as EventInput;
    }

    return obj;
  });
}
