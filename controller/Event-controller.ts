import { Request, Response } from "express";
import { EventService } from "../service/EventService";
import { decodeJwt } from "../HelperFunction/jwtHelper";
import { LogController } from "./log-controller";

export interface EventPayload {
  date: string;
  eventName: string;
  eventDescripition: string;
  tag: any[];
}

export class EventController {
  static postEvent(request: Request, response: Response) {
    const jwtPayload = decodeJwt(request);
    const bodyData: EventPayload = request.body;
    try {
      if (jwtPayload && jwtPayload.id) {
        if (
          bodyData &&
          bodyData.date &&
          bodyData.eventName &&
          bodyData.eventDescripition &&
          bodyData.tag &&
          (typeof bodyData.tag === "object" ||
            (typeof bodyData.tag === "string" && bodyData.tag === "all"))
        ) {
          EventService.postEventService(jwtPayload.id, bodyData)
            .then((data) => {
              response.status(200).json(data);
            })
            .catch((e) => {
              console.log(e);
              response.status(500).json({ message: e });
            });
        } else {
          response.status(500).json({ message: "Invalid Payload" });
        }
      } else {
        response.status(500).json({ message: "Invalid Jwt" });
      }
    } catch (error) {
      console.log(
        LogController.errorMes("EventController-postEvent", error),
        error
      );
      response
        .status(500)
        .json({
          message: LogController.errorMes("EventController-postEvent", error),
          error,
        });
    }
  }
  static getEvent(request: Request, response: Response) {
    const jwtPayload = decodeJwt(request);
    const paramsQuery = request.query;
    try {
      if (jwtPayload && jwtPayload.id) {
        EventService.getEventService(jwtPayload.id, paramsQuery)
          .then((data: any) => {
            if (data && data.length > 0) {
              const formattedResponse = data.map((doc: any) => {
                const events = doc.events.sort(
                  (a: any, b: any) =>
                    -(new Date(a.date).getTime() - new Date(b.date).getTime())
                );
                const document = {
                  id: events[0].eventId,
                  start: events[0].date,
                  title: events[0].eventName,
                  eventDescripition: events[0].eventDescripition,
                  color: events[0].color,
                  eventCount: events.length,
                  events: events,
                };
                return document;
              });
              response.status(200).json(formattedResponse);
            } else {
              response.status(200).json(data);
            }
          })
          .catch((e) => {
            console.log(e);
            response.status(500).json({ message: e });
          });
      } else {
        response.status(500).json({ message: "Invalid Jwt" });
      }
    } catch (error) {
      console.log(
        LogController.errorMes("EventController-getEvent", error),
        error
      );
      response
        .status(500)
        .json({
          message: LogController.errorMes("EventController-getEvent", error),
          error,
        });
    }
  }
  static getTaggedUser(request: Request, response: Response) {
    const jwtPayload = decodeJwt(request);
    try {
      if (jwtPayload && jwtPayload.id) {
        EventService.getTaggedUserService(jwtPayload.id)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((e) => {
            console.log(
              LogController.errorMes("EventController-getTaggedUser", e),
              e
            );
            response
              .status(500)
              .json({
                message: LogController.errorMes(
                  "EventController-getTaggedUser",
                  e
                ),
                error: e,
              });
          });
      } else {
        response.status(500).json({ message: "Invalid Jwt" });
      }
    } catch (error) {
      console.log(
        LogController.errorMes("EventController-getTaggedUser", error),
        error
      );
    }
  }
  static postBatchEvent(request: Request, response: Response) {
    const id = request.params.id;
    const bodyData = request.body;
    const jwtPayload = decodeJwt(request);
    try {
      if (jwtPayload && jwtPayload.id) {
        if (
          bodyData &&
          bodyData.date &&
          bodyData.eventName &&
          bodyData.eventDescripition
        ) {
          EventService.postBatchEvent(id, bodyData, jwtPayload.id)
            .then((data) => {
              response.status(200).json(data);
            })
            .catch((e) => {
              console.log(
                e,
                LogController.errorMes("Eventbat-postBatchEvent", e)
              );
              response.status(500).json({ message: e });
            });
        } else {
          response.status(500).json({ message: "Invalid Payload" });
        }
      } else {
        response.status(500).json({ message: "Invalid JWT" });
      }
    } catch (error) {
      console.log(
        error,
        LogController.errorMes("Eventbat-postBatchEvent", error)
      );
      response
        .status(500)
        .json({
          message: LogController.errorMes("Eventbatch-postBatchEvent", error),
        });
    }
  }
  static deleteEvent(request: Request, response: Response) {
    const eventId = request.params.id;
    const jwtPayload = decodeJwt(request);

    try {
      if (jwtPayload && jwtPayload.id) {
        EventService.deleteEventService(eventId, jwtPayload.id)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((error) => {
            console.log(
              LogController.errorMes(
                "EventControllerDelete-deleteEvent",
                error
              ),
              error
            );
            response
              .status(500)
              .json({
                message: LogController.errorMes(
                  "EventControllerDelete-deleteEvent",
                  error
                ),
                error,
              });
          });
      } else {
        response.status(500).json({ message: "Invalid JWT" });
      }
    } catch (error) {
      console.log(
        LogController.errorMes("EventControllerDelete-deleteEvent", error),
        error
      );
      response
        .status(500)
        .json({
          message: LogController.errorMes("EventControllerDelete-", error),
          error,
        });
    }
  }
  static updateEvent(request: Request, response: Response) {
    const eventId = request.params.id;
    const jwtPayload = decodeJwt(request);
    const bodyData = request.body;

    try {
      if (jwtPayload && jwtPayload.id) {
        if (
          bodyData &&
          (bodyData.eventDescripition || bodyData.eventName || bodyData.color)
        ) {
          EventService.updateEvent(eventId, jwtPayload.id, bodyData)
            .then((data) => {
              response.status(200).json(data);
            })
            .catch((error) => {
              console.log(
                LogController.errorMes("EventController-updateEvent", error),
                error
              );
              response
                .status(500)
                .json({
                  message: LogController.errorMes(
                    "EventController-updateEvent",
                    error
                  ),
                  error,
                });
            });
        } else {
          response.status(500).json({ message: "Invalid payload" });
        }
      } else {
        response.status(500).json({ message: "Invalid JWT" });
      }
    } catch (error) {
      console.log(
        LogController.errorMes("EventController-updateEvent", error),
        error
      );
      response
        .status(500)
        .json({
          message: LogController.errorMes("EventController-updateEvent", error),
          error,
        });
    }
  }
  static scheduleInterview(request: Request, response: Response) {
    const studentId = request.params.id;
    const jwtPayload = decodeJwt(request);
    const bodyData = request.body;
    try {
      if (jwtPayload && jwtPayload.id) {
        EventService.scheduleInterviewService(
          jwtPayload.id,
          studentId,
          bodyData
        )
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((e) => {
            console.log(e);
            response.status(500).json({ message: e });
          });
      } else {
        response.status(500).json({ message: "Invalid JWT" });
      }
    } catch (error) {
      console.log(
        error,
        LogController.errorMes("EventController-scheduleInterview", error)
      );
    }
  }
  static getInterviewList(request: Request, response: Response) {
    const jwtPayload = decodeJwt(request);
    try {
      if (jwtPayload && jwtPayload.id) {
        EventService.getInterviewListService(jwtPayload.id)
          .then((data) => {
            response.status(200).json(data);
          })
          .catch((error) => {
            console.log(
              error,
              LogController.errorMes("EventController-getInterviewList", error)
            );
            response
              .status(500)
              .json({
                message: LogController.errorMes(
                  "EventController-getInterviewList",
                  error
                ),
              });
          });
      } else {
        response.status(500).json({ message: "Invalid JWT" });
      }
    } catch (error) {
      console.log(
        error,
        LogController.errorMes("EventController-getInterviewList", error)
      );
      response
        .status(500)
        .json({
          message: LogController.errorMes(
            "EventController-getInterviewList",
            error
          ),
        });
    }
  }
}
