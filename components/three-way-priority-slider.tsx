"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

type PriorityValues = [number, number, number];

type Props = {
  labels?: [string, string, string];
  values: PriorityValues;
  onChange: (values: PriorityValues) => void;
};

export default function ThreeWayPrioritySlider({
  labels = [
    "Ưu tiên chi phí thấp",
    "Ưu tiên thời gian nhanh",
    "Ưu tiên khoảng cách gần",
  ],
  values,
  onChange,
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [activeHandle, setActiveHandle] = useState<
    1 | 2 | null
  >(null);

  const [cost, time, distance] = values;

  // Divider 1 = kết thúc phần cost
  // Divider 2 = kết thúc phần time
  const divider1 = cost;
  const divider2 = cost + time;

  // Không cho bất kỳ phần nào nhỏ hơn 5%
  const minSegment = 5;

  const clamp = (
    value: number,
    min: number,
    max: number
  ) => {
    return Math.min(Math.max(value, min), max);
  };

  const clientXToPercent = useCallback(
    (clientX: number) => {
      const track = trackRef.current;

      if (!track) return 0;

      const rect = track.getBoundingClientRect();

      const x = clientX - rect.left;

      const percent = (x / rect.width) * 100;

      return clamp(percent, 0, 100);
    },
    []
  );

  const updateFirstHandle = useCallback(
    (clientX: number) => {
      let nextDivider1 = clientXToPercent(clientX);

      nextDivider1 = clamp(
        nextDivider1,
        minSegment,
        divider2 - minSegment
      );

      const nextCost = nextDivider1;
      const nextTime = divider2 - nextDivider1;
      const nextDistance = 100 - divider2;

      onChange([
        Math.round(nextCost),
        Math.round(nextTime),
        Math.round(nextDistance),
      ]);
    },
    [clientXToPercent, divider2, onChange]
  );

  const updateSecondHandle = useCallback(
    (clientX: number) => {
      let nextDivider2 = clientXToPercent(clientX);

      nextDivider2 = clamp(
        nextDivider2,
        divider1 + minSegment,
        100 - minSegment
      );

      const nextCost = divider1;
      const nextTime = nextDivider2 - divider1;
      const nextDistance = 100 - nextDivider2;

      onChange([
        Math.round(nextCost),
        Math.round(nextTime),
        Math.round(nextDistance),
      ]);
    },
    [clientXToPercent, divider1, onChange]
  );

  const handlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    handle: 1 | 2
  ) => {
    event.preventDefault();

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    setActiveHandle(handle);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLButtonElement>,
    handle: 1 | 2
  ) => {
    if (activeHandle !== handle) return;

    event.preventDefault();

    if (handle === 1) {
      updateFirstHandle(event.clientX);
    } else {
      updateSecondHandle(event.clientX);
    }
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    setActiveHandle(null);
  };

  const handleTrackPointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (
      (event.target as HTMLElement).closest(
        ".priority-slider-handle"
      )
    ) {
      return;
    }

    const percent = clientXToPercent(
      event.clientX
    );

    const distanceToFirst = Math.abs(
      percent - divider1
    );

    const distanceToSecond = Math.abs(
      percent - divider2
    );

    if (distanceToFirst <= distanceToSecond) {
      updateFirstHandle(event.clientX);
    } else {
      updateSecondHandle(event.clientX);
    }
  };

  return (
    <div className="priority-slider-card">
      {/* THÔNG SỐ */}
      <div className="priority-summary">
        <div className="priority-summary-item">
          <div className="priority-summary-title">
            <span className="priority-dot priority-dot-cost" />

            <span>{labels[0]}</span>
          </div>

          <strong>{cost}%</strong>
        </div>

        <div className="priority-summary-item">
          <div className="priority-summary-title">
            <span className="priority-dot priority-dot-time" />

            <span>{labels[1]}</span>
          </div>

          <strong>{time}%</strong>
        </div>

        <div className="priority-summary-item">
          <div className="priority-summary-title">
            <span className="priority-dot priority-dot-distance" />

            <span>{labels[2]}</span>
          </div>

          <strong>{distance}%</strong>
        </div>
      </div>

      {/* SLIDER */}
      <div className="priority-slider-area">
        <div
          ref={trackRef}
          className="priority-slider-track"
          onPointerDown={handleTrackPointerDown}
        >
          {/* Cost */}
          <div
            className="priority-slider-section priority-slider-cost"
            style={{
              width: `${cost}%`,
            }}
          />

          {/* Time */}
          <div
            className="priority-slider-section priority-slider-time"
            style={{
              width: `${time}%`,
            }}
          />

          {/* Distance */}
          <div
            className="priority-slider-section priority-slider-distance"
            style={{
              width: `${distance}%`,
            }}
          />

          {/* HANDLE 1 */}
          <button
            type="button"
            aria-label="Điều chỉnh tỷ trọng chi phí và thời gian"
            className={`priority-slider-handle ${
              activeHandle === 1
                ? "priority-slider-handle-active"
                : ""
            }`}
            style={{
              left: `${divider1}%`,
            }}
            onPointerDown={(event) =>
              handlePointerDown(event, 1)
            }
            onPointerMove={(event) =>
              handlePointerMove(event, 1)
            }
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />

          {/* HANDLE 2 */}
          <button
            type="button"
            aria-label="Điều chỉnh tỷ trọng thời gian và khoảng cách"
            className={`priority-slider-handle ${
              activeHandle === 2
                ? "priority-slider-handle-active"
                : ""
            }`}
            style={{
              left: `${divider2}%`,
            }}
            onPointerDown={(event) =>
              handlePointerDown(event, 2)
            }
            onPointerMove={(event) =>
              handlePointerMove(event, 2)
            }
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        </div>
      </div>
    </div>
  );
}