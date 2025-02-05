import { Request, Response, NextFunction } from "express";
import StockRequestService from "../services/StockRequesteService";
import BaseController from "../core/BaseController";

export class StockRequestController extends BaseController {
  private stockRequestService: StockRequestService;

  constructor() {
    super();
    this.stockRequestService = new StockRequestService();

    this.createStockRequest = this.createStockRequest.bind(this);
    this.updateStockRequest = this.updateStockRequest.bind(this);
    this.getAllStockRequests = this.getAllStockRequests.bind(this);
    // this.approveStockRequest = this.approveStockRequest.bind(this);
    // this.rejectStockRequest = this.rejectStockRequest.bind(this);
    // this.issueStockRequest = this.issueStockRequest.bind(this);
  }

  /**
   * Create a new stock request
   */
  createStockRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.handleRequest(req, res, next, async () => {
      const { requester, items } = req.body;
      return this.stockRequestService.createStockRequest(requester, items);
    });
  };
  async updateStockRequest(req: Request, res: Response, next: NextFunction) {
    this.handleRequest(req, res, next, async () => {
      const { id, action } = req.params;

      switch (action) {
        case "approve":
          return this.stockRequestService.approveStockRequest(id);
        case "reject":
          return this.stockRequestService.rejectStockRequest(id);
        case "issue":
          const { issuedItems } = req.body;
          if (!issuedItems)
            throw new Error("issuedItems is required for issuing stock");
          return this.stockRequestService.issueStockRequest(id, issuedItems);
        default:
          throw new Error(`Invalid action: ${action}`);
      }
    });
  }
  async getAllStockRequests(req: Request, res: Response, next: NextFunction) {
    this.handleRequest(req, res, next, async () => {
      return this.stockRequestService.findAll();
    });
  }

  /**
   * Approve a stock request
   */
  //   approveStockRequest = async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ) => {
  //     this.handleRequest(req, res, next, async () => {
  //       const { id } = req.params;
  //       return this.stockRequestService.approveStockRequest(id);
  //     });
  //   };

  //   /**
  //    * Reject a stock request
  //    */
  //   rejectStockRequest = async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ) => {
  //     this.handleRequest(req, res, next, async () => {
  //       const { id } = req.params;
  //       return this.stockRequestService.rejectStockRequest(id);
  //     });
  //   };

  //   /**
  //    * Issue stock from a stock request
  //    */
  //   issueStockRequest = async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ) => {
  //     this.handleRequest(req, res, next, async () => {
  //       const { id } = req.params;
  //       const { issuedItems } = req.body;
  //       return this.stockRequestService.issueStockRequest(id, issuedItems);
  //     });
}
