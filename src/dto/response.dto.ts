/**
 * @fileoverview This module provides an interface for response data transfer object.
 * @module ResponseDTO
 */

/**
 * @interface
 * @description This interface provides a structure for response data transfer object.
 */
export default interface ResponseDTO<T> {
  /** The data of the response. */
  data?: T;

  /** The success status of the response. */
  success: boolean;

  /** The message of the response. */
  message: string | string[];
}
